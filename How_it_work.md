> 🌐 Language / Ngôn ngữ: **English** | [Tiếng Việt](How_it_work.vi.md)

Observer Pattern - Restaurant - Vue 2
=================

An example of applying the Observer Pattern to a simple restaurant project with Vue 2.

This Vue 2 version first shows a loading screen while the runtime fetches the root template, menu data, Vuex store, and Vue single-file components directly in the browser. The first fully rendered screen then appears with the welcome modal still open, while the control area, chefs, assistant panel, and tables are already visible underneath.

There are 2 chefs in this demo so you can follow the cooking assignment flow.

This walkthrough combines the detailed step-by-step explanation with the screenshot narrative that is only summarized in the README.

Main UI States
------------

The loading screen shown before the Vue app finishes booting:

![Application loading](./screenshots/app-loading.png)

The first fully rendered screen, still showing the welcome modal:

![Application ready state](./screenshots/app-loaded.png)

Adding a table from the Controls panel:

![Add table](./screenshots/add-table.png)

The popup used to choose dishes for a table, with several dishes already selected in this example:

![Choose dishes](./screenshots/add-dishes.png)

The confirmation dialog shown before removing a table:

![Confirm table removal](./screenshots/confirm-delete-table.png)

Subscription, unsubscription, and removal action tooltips:

![Tooltip actions](./screenshots/tooltip.png)


Main Flow
------------

1. Wait for the loading screen to finish so the runtime can fetch `assets/app.html`, `assets/data.json`, the store module, and the Vue components in the browser.
2. Click the `Add Dishes` button on any table to open the popup and see the dishes available for selection.
3. Click the dish name buttons to select dishes. You can select multiple dishes.
4. Click `Order` to create one order item for each selected dish. The selected table sends those dishes into the restaurant workflow, and the **Assistant** queue is updated for that table.
5. The Assistant adds the incoming orders to its queue, waits 3 seconds, and then assigns pending dishes to chefs that are currently available.
6. While a chef is busy, the chef card shows the current dish and a progress bar. When the dish is ready, the chef notifies the Assistant.
7. The Assistant records both pickup and completion events in its activity log and notifies subscribed tables about the dish that has just finished cooking.
8. If a table ordered that completed dish, it starts its eating progress and then removes the dish from its list when the progress finishes.

Notes While Watching
------------

1. This version shows a loading screen before the main screen appears, then keeps the welcome modal open on the first render.
2. The Assistant assigns dishes to the chefs 3 seconds after receiving them from the tables.
3. Chefs notify the Assistant: each chef has an **Observer**, and the **Assistant** subscribes to updates from the chefs.
    1. A chef shows a pink border when a dish is finished.
    2. The Assistant shows a blue border and writes a log below when it receives a notification.
    3. The Assistant immediately notifies all tables.
4. The Assistant notifies the tables: the Assistant has an **Observer**, and the tables subscribe to updates from the Assistant.
    1. Tables show a yellow border and the `Receive updates from the assistant` tooltip when they receive a notification.
    2. A table that ordered the notified dish will display an eating progress bar.
5. The tooltip image above shows both idle subscription states, `Subscribe to assistant updates` and `Unsubscribe from assistant updates`, plus the remove-table action.

Observer Workflow Sequence
------------

Two chefs can be preparing dishes at the same time while another table is already eating a dish that finished earlier:

![Process step 1](./screenshots/process-1.png)

When the Assistant broadcasts a completed dish, subscribed tables highlight together, and the tables that ordered it immediately start eating:

![Process step 2](./screenshots/process-2.png)

One chef can still be cooking while the other is already idle after finishing a dish, and the subscribed table still shows the tooltip for receiving Assistant updates:

![Process step 3](./screenshots/process-3.png)

The Assistant activity log keeps recording new pickup and completion events while delivered dishes continue building up on the tables:

![Process step 4](./screenshots/process-4.png)

Subscribed tables continue reacting in parallel while chefs keep working through the queue:

![Process step 5](./screenshots/process-5.png)

A later state still shows subscribed tables reacting while the Assistant continues recording both pickup and completion events:

![Process step 6](./screenshots/process-6.png)

-------------------

\ ゜o゜)ノ