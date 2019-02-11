# AngularFabricjsConstraints

This app aims to be a proof-of-concept for binding canvas objects to a model representation. This is
required to realize creating a floor plan with components that depend on one another.

The resulting behavior should:

- snap all free floating components to a grid
- snap dependent components to parent components (snap points)
- create a ghost object when dragging an object between snap points
- highlight snap points when dragging a dependent component

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
