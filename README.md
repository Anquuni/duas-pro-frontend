# duas.pro Frontend

This is the frontend repository for duas.pro, a comprehensive web application providing access to 80+ Shia Islamic supplications (duas) and pilgrimage prayers (ziyarat) in 8 different languages. The frontend interacts with the [Shia Duas API](https://github.com/duas-pro/shia-duas-api) to deliver a user-friendly interface for accessing and interacting with this spiritual content.

## Features

- Access to 80+ Shia Islamic supplications (duas) and pilgrimage prayers (ziyarat)
- Multi-language support with 8 different languages available
- Audio playback of duas
- Line-by-line translations with timestamps
- Responsive design for various devices and screen sizes
- User-friendly interface for easy navigation and dua selection
- Personalization options:
  - Adjustable font size
  - Customizable order of translations
  - Dark and light mode
- Three different viewing modes:
  - Line-by-line view
  - Full text view (as in a book)
  - Presentation mode
- “Live-Reading” to read together in their respective language in a group

## Technology

This frontend is built using [SvelteKit](https://kit.svelte.dev/) and [shadcn](https://www.shadcn-svelte.com/), providing a modern and responsive user interface.

## Live Website

You can access the live version of duas.pro at [https://duas.pro](https://duas.pro).

## Local Development

To set up the project locally:

1. Clone the repository:
   `git clone https://github.com/duas-pro/duas-pro-frontend.git`
2. Navigate to the project directory:
   `cd duas-pro-frontend`
3. Install dependencies:
   `npm install`
4. Start the development server:
   `npm run dev`

## API Integration

This frontend integrates with the Shia Duas API. You can find more information about the API [here](https://github.com/duas-pro/shia-duas-api).

## Upcoming Features and Roadmap

We are continuously working to improve duas.pro. Our plans for future development include:

1. Evolving into a Progressive Web App (PWA) for offline functionality
2. Support for last-read tracking, bookmarks, and favorite Duas
3. Full-text search and advanced filtering across all Dua content
4. Integration with the upcoming notification system for duas
5. Enhancing the “Live Reading” feature, including session planning and improved handling of edge cases (e.g. when the host is offline)
6. Visualization of dua reading analytics and trends
7. Viualization of dua recommendations based on personal user preferences

## Contribution

We welcome contributions to the duas.pro frontend! If you have suggestions, bug reports, or want to contribute code, please feel free to open an issue or submit a pull request.

Contributors:

<a href="https://github.com/anquuni/duas-pro-frontend/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=anquuni/duas-pro-frontend" />
</a>
