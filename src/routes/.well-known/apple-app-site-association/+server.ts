import { json } from "@sveltejs/kit";

// iOS Universal Links — update appIDs with your Apple Team ID + bundle ID before App Store submission.
// Format: "TEAMID.com.duaspro.app"
// https://developer.apple.com/documentation/xcode/supporting-associated-domains
export function GET() {
  return json({
    applinks: {
      details: [
        {
          appIDs: ["TEAMID.com.duaspro.app"],
          components: [
            { "/": "/*/duas/*", comment: "Dua detail pages" },
            { "/": "/*/collections/*", comment: "Collection pages" },
            { "/": "/*", comment: "All other pages" }
          ]
        }
      ]
    },
    webcredentials: {
      apps: ["TEAMID.com.duaspro.app"]
    }
  });
}
