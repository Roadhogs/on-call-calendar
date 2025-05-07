import fetch from "node-fetch";
import ical from "node-ical";
import { writeFileSync } from "fs";

const url = process.env.PD_ICAL_URL;

async function main() {
  const data = await fetch(url).then(res => res.text());
  const parsed = ical.parseICS(data);

  const events = Object.values(parsed)
    .filter(event => event.type === "VEVENT")
    .map(event => ({
      title: event.summary,
      start: event.start,
      end: event.end,
      url: event.url || null
    }));

  writeFileSync("public/oncall.json", JSON.stringify(events, null, 2));
  console.log("✅ Wrote oncall.json with", events.length, "events");
}

main().catch(err => {
  console.error("❌ Error:", err);
  process.exit(1);
});
