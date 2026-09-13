/*
 * Single source of truth for the DIY Vibes dashboard.
 *
 * To add a new animation:
 *   1. Drop a short .mp4 into assets/videos/ (used only for the dashboard's
 *      hover-preview thumbnail — not shown anywhere else)
 *   2. Build the real interactive version as a new page in
 *      interactions/src/pages/ui-animations/ (see interactions/README.md)
 *      and add its route number as `live` below
 *   3. Add one entry to CLIPS below (file, title, desc, live)
 *   That's it — index.html reads from this file to build the grid, and
 *   every card opens interactions/dist/#/<live> full-screen.
 *
 * `live` is a route number in the interactions app (interactions/dist/,
 * built from real source pulled from github.com/alexisbardini/diyvibes —
 * see interactions/README.md for how to pull updates or duplicate a page).
 *
 * To change the featured game/demo, edit GAME below.
 */
window.DIY_ITEMS = {
  GAME: {
    title: "Capybara Obby",
    tags: ["3D Game", "Three.js"],
    desc: "A full obstacle-course platformer starring a capybara — 5 levels (staircase, gaps, moving bridge, big jump, zigzag), hat picker, themes, and confetti on the win screen. Needs an internet connection on first load for the Three.js CDN.",
    cover: "assets/game/cover.jpg",
    href: "assets/game/?step=9",
  },

  CLIPS: [
    { file: "01-publish-button-entry.mp4", title: "Publish button entry", desc: "The publish button's entry animation as it appears on screen.", live: 1 },
    { file: "02-publish-icon-button.mp4", title: "Publish icon button", desc: "Icon-only variant of the publish button interaction.", live: 2 },
    { file: "03-play-counter.mp4", title: "Play counter", desc: "The play counter ticking up in real time.", live: 3 },
    { file: "04-chat-message.mp4", title: "Chat message send", desc: "A kid sends a chat message and it lands in the thread.", live: 4 },
    { file: "05-chatdino-reply.mp4", title: "ChatDino reply", desc: "ChatDino types out a response, then gives a safe reply.", live: 5 },
    { file: "06-dino-island-inspo-board.mp4", title: "Dino island inspo board", desc: "Browsing the dino island inspiration board.", live: 6 },
    { file: "07-parent-alert.mp4", title: "Parent alert", desc: "“Something to look at” — the parent-facing alert moment.", live: 7 },
    { file: "08-chatdino-qr-download.mp4", title: "ChatDino QR download", desc: "QR download flow for ChatDino, shown across iPad and iPhone.", live: 8 },
    { file: "09-diy-qr-download.mp4", title: "DIY QR download", desc: "QR download flow for DIY, shown across iPad and iPhone.", live: 9 },
    { file: "10-research-collage.mp4", title: "Research collage", desc: "The research board with a red panda image collage.", live: 10 },
    { file: "11-video-feed.mp4", title: "Video feed scroll", desc: "Scrolling through the vertical video feed.", live: 11 },
    { file: "12-map-london-eye.mp4", title: "Map: London Eye", desc: "The map pans over to the London Eye and drops a pin.", live: 12 },
    { file: "13-homework-board.mp4", title: "Homework board", desc: "Scrolling the “My Volcano Project” pin board.", live: 13 },
    { file: "14-quiz-fan-deck.mp4", title: "Quiz fan deck", desc: "Stacked fan of quiz cards — swipe through with a confetti finish.", live: 14 },
    { file: "15-study-page.mp4", title: "Study page", desc: "Study page flow: scroll, take the quiz, watch the score tick up.", live: 15 },
    { file: "16-pin-entry.mp4", title: "Parent PIN entry", desc: "Entering a parent PIN — dots turn green as digits land.", live: 16 },
    { file: "17-chat-field-typing.mp4", title: "Chat field typing", desc: "ChatDino's chat field types out text, cursor clicks send.", live: 17 },
  ],
};
