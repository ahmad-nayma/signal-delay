# UI Refactoring: Live Design Preview and Relocating Danger Deck

I need to refactor the main interface of this project to improve the user experience. Please analyze the current component tree and state management, then implement the following changes:

## 1. Implement a "LIVE DESIGN PREVIEW"
- Locate the current position of the **"DANGER DECK"** component/section in the main UI layout.
- Replace this exact location with a new component named `LiveDesignPreview`.
- Connect `LiveDesignPreview` to the application's state (e.g., Redux, Context, or local state) so it can access the current rocket configuration.
- The preview must be dynamic: it should visually render the base rocket and overlay/display all the parts currently added to it in real-time. Whenever a user adds or removes a part, this visual representation must update instantly.

## 2. Relocate the "DANGER DECK"
- Do not delete the `DangerDeck` component. Instead, move it to a secondary, less prominent location in the interface.
- **Suggested placements:** Move it to a collapsible side drawer, a secondary tab next to the build controls, or a dedicated bottom panel (footer area). Choose the placement that best fits the existing layout without breaking the CSS structure.
- Ensure that the moved `DangerDeck` still receives all necessary props and maintains its current functionality/logic perfectly in its new location.

## 3. Deliverables & Instructions
- Provide the code for the new `LiveDesignPreview` component.
- Provide the updated code for the Parent layout file(s) where the replacement and relocation occurred.
- Briefly list which files were modified so I can easily apply the changes.