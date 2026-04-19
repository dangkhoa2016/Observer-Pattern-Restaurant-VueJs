# Cross-Project Parity Guide

> 🌐 Language / Ngôn ngữ: **English** | [Tiếng Việt](./PARITY_GUIDE.vi.md)
>
> Related repositories:
> - [Observer-Pattern-Restaurant](https://github.com/dangkhoa2016/Observer-Pattern-Restaurant)
> - [Observer-Pattern-Restaurant-VueJs](https://github.com/dangkhoa2016/Observer-Pattern-Restaurant-VueJs)

This guide maps the Vue 2 implementation to the plain JavaScript implementation so developers can move between the two codebases without re-learning the domain model.

## Module Map

| Vue 2 | Plain JavaScript | Responsibility |
| --- | --- | --- |
| `vue/restaurant.vue` + `vue/stores/restaurantStore.js` | `assets/js/models/restaurant.js` | Bootstraps the app and wires chefs, tables, assistant, and order flow. |
| `vue/panel-action.vue` + `vue/panel-action.js` | `assets/js/models/panel-action.js` | Control panel for adding tables and toggling the action card. |
| `vue/modal-foods.vue` + `vue/modal-foods.js` + `vue/food-item.vue` + `vue/food-item.js` | `assets/js/models/food-list.js` + `assets/js/views/food-list-view.js` | Menu modal, food selection, and order submission. |
| `vue/table-item.vue` + `vue/table-item.js` + `vue/order-food.vue` + `vue/order-food.js` | `assets/js/models/table.js` + `assets/js/views/table-view.js` | Table card, subscription state, ordered dishes, and eating progress. |
| `vue/assistant.vue` + `vue/assistant.js` + `vue/assistant-log.vue` + `vue/assistant-log.js` | `assets/js/models/assistant.js` | Queue incoming orders, dispatch them to chefs, and publish completed dishes. |
| `vue/chef.vue` + `vue/chef.js` | `assets/js/models/chef.js` + `assets/js/views/chef-view.js` | Chef status, progress UI, and completed dish notifications. |
| `vue/processing.vue` + `vue/processing.js` + `vue/progress-bar.vue` + `vue/progress-bar.js` | `assets/js/models/progress.js` + `assets/js/views/progress-view.js` | Animated progress bars and manual completion button. |
| `vue/stores/restaurantStore.js` state + local component state | `assets/js/models/*-state.js` | Domain state is store-driven in Vue and class-based in plain JS. |

## Shared Vocabulary

| Domain action | Vue 2 | Plain JavaScript |
| --- | --- | --- |
| Add a table | `restaurantStore/addTable` via `panel-action.vue` | `Restaurant.addTable()` and `add_table()` |
| Open the dish picker for a table | `table-item.js -> showMenuForTable() -> restaurantStore/setCurrentTableId` | `FoodList.showMenuFor()` and `show_menu_for()` |
| Queue submitted orders | `assistant.js` watches `selectedFoods` and pushes into its local queue | `Assistant.addOrders()` and `add_orders()` |
| Assign an order to a chef | `assistant.js -> dispatchToChef()` -> `restaurantStore/assignOrderToChef` | `Assistant.#send_to_chef()` -> `Chef.processOrder()` |
| Update chef/order status | `restaurantStore/updateChefOrderStatus` | `Chef.processOrder()` and private state transition methods |
| Store completed dishes by table | `restaurantStore/storeCompletedOrdersForTable` + `table-item.js` watcher | assistant completion event + `Table.receiveFood()` |
| Subscribe a table to assistant updates | `table-item.js -> subscribeToAssistant()` | `Table.subscribeToAssistant()` and `subscribe_to_assistant()` |
| Unsubscribe a table | `table-item.js -> unsubscribeFromAssistant()` | `Table.unsubscribeFromAssistant()` and `unsubscribe_from_assistant()` |

## Reading Tips

- The Vue store now exposes clearer domain names such as `setCurrentTableId`, `assignOrderToChef`, `updateChefOrderStatus`, and `storeCompletedOrdersForTable`. Legacy store aliases still exist to avoid breaking older code.
- The plain JavaScript repo now keeps the original snake_case methods as compatibility aliases, but the camelCase methods are the preferred names when you compare them to Vue.
- If you want to compare the core Observer loop, start with `restaurantStore.js` and `assistant.js` in Vue, then read `Restaurant` and `Assistant` in the [plain JavaScript project](https://github.com/dangkhoa2016/Observer-Pattern-Restaurant).
