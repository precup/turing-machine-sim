# Modal

Files in this folder are used for logic to handle the modals menus.
Modals are overlayed on top of the rest of the screen, and have
specific purposes. Each modal menu has one file in this directory.

modal.js contains logic that is present in all of the modal menus or
that is used to propogate modal events to the appropriate objects. For
example, a call to gModalMenu.submit("load") propogates the event to
the gModalMenu.load object through a switch statement based on the 
string parameter.

List of modals:
- Confirmation (confirm.js)
- Edge editing (edge.js) and TM Edge Editing (tmedge.js)
- Node editing (node.js)
- Loading saved automata (load.js)
- Bulk Testing (testing.js)
- Adding characters to tape set alphabet (tapeSet.js)
- Submission (submit.js)
- Saving (saveas.js)