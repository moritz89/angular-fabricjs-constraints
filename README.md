# AngularFabricjsConstraints

This app aims to be a proof-of-concept for binding canvas objects to a model representation. This is
required to realize creating a floor plan with components that depend on one another.

The resulting behavior should:

- snap all free floating components to a grid
- snap dependent components to parent components (snap points)
- create a ghost object when dragging an object between snap points
- highlight snap points when dragging a dependent component

To implement this create group types that are added via dependency injection:

- Water Cycle
- Electrical Grid
- Data Network
- Greenhouse
- Lighting Group

Components (e.g., pipes, pumps, plants) are part of one or more groups that they interact with. This means that pumps would be assigned to a water cycle, electrical grid, data network and greenhouse while a plant would be assigned to a water cycle, greenhouse and lighting group. On creation, each component would register itself with each injected group and remove itself on deletion.

**Bonus:** find a method to serialize the components to:

- be stored in a database
- run simulations with

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
