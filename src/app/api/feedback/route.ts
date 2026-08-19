import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, description, contact, metadata } = body;

    if (!description || description.trim().length < 5) {
      return NextResponse.json({ error: "Description too short" }, { status: 400 });
    }

    const webhookUrl = process.env.DISCORD_FEEDBACK_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error("DISCORD_FEEDBACK_WEBHOOK_URL is not set");
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    const categoryEmoji: Record<string, string> = {
      bug: "🐛",
      suggestion: "💡",
      other: "💬",
    };

    const emoji = categoryEmoji[category] || "💬";

    const embed = {
      title: `${emoji} New Feedback: ${category.charAt(0).toUpperCase() + category.slice(1)}`,
      color: category === "bug" ? 0xff4444 : category === "suggestion" ? 0x4CAF50 : 0x7289da,
      fields: [
        {
          name: "📝 Description",
          value: description.trim().slice(0, 1024),
          inline: false,
        },
        ...(contact
          ? [{ name: "📬 Contact", value: contact.trim().slice(0, 256), inline: true }]
          : []),
        {
          name: "🌐 Page",
          value: metadata?.url || "Unknown",
          inline: true,
        },
        {
          name: "🌍 Language",
          value: metadata?.language || "Unknown",
          inline: true,
        },
        {
          name: "🖥️ Browser",
          value: metadata?.userAgent?.slice(0, 256) || "Unknown",
          inline: false,
        },
        {
          name: "📐 Screen",
          value: metadata?.screen || "Unknown",
          inline: true,
        },
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: "Nodle Feedback System",
      },
    };

    const discordPayload = { embeds: [embed] };

    const discordRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(discordPayload),
    });

    if (!discordRes.ok) {
      const errorText = await discordRes.text();
      console.error("Discord webhook error:", errorText);
      return NextResponse.json({ error: "Failed to send to Discord" }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Feedback API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
