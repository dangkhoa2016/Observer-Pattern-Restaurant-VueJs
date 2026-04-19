# Hướng Dẫn Đối Chiếu Giữa Hai Dự Án

> 🌐 Language / Ngôn ngữ: [English](./PARITY_GUIDE.md) | **Tiếng Việt**
>
> Kho mã liên quan:
> - [Observer-Pattern-Restaurant](https://github.com/dangkhoa2016/Observer-Pattern-Restaurant)
> - [Observer-Pattern-Restaurant-VueJs](https://github.com/dangkhoa2016/Observer-Pattern-Restaurant-VueJs)

Tài liệu này đối chiếu cách triển khai Vue 2 với cách triển khai plain JavaScript để lập trình viên có thể di chuyển giữa hai codebase mà không phải học lại mô hình nghiệp vụ.

## Ánh Xạ Module

| Vue 2 | Plain JavaScript | Trách nhiệm |
| --- | --- | --- |
| `vue/restaurant.vue` + `vue/stores/restaurantStore.js` | `assets/js/models/restaurant.js` | Khởi động ứng dụng và nối chefs, tables, assistant, cùng luồng xử lý order. |
| `vue/panel-action.vue` + `vue/panel-action.js` | `assets/js/models/panel-action.js` | Bảng điều khiển để thêm bàn và bật/tắt action card. |
| `vue/modal-foods.vue` + `vue/modal-foods.js` + `vue/food-item.vue` + `vue/food-item.js` | `assets/js/models/food-list.js` + `assets/js/views/food-list-view.js` | Modal menu, chọn món, và gửi order. |
| `vue/table-item.vue` + `vue/table-item.js` + `vue/order-food.vue` + `vue/order-food.js` | `assets/js/models/table.js` + `assets/js/views/table-view.js` | Card bàn, trạng thái subscribe, các món đã gọi, và tiến trình ăn món. |
| `vue/assistant.vue` + `vue/assistant.js` + `vue/assistant-log.vue` + `vue/assistant-log.js` | `assets/js/models/assistant.js` | Xếp hàng order đầu vào, phân phối cho chefs, và phát thông báo món đã hoàn tất. |
| `vue/chef.vue` + `vue/chef.js` | `assets/js/models/chef.js` + `assets/js/views/chef-view.js` | Trạng thái chef, giao diện progress, và thông báo món hoàn tất. |
| `vue/processing.vue` + `vue/processing.js` + `vue/progress-bar.vue` + `vue/progress-bar.js` | `assets/js/models/progress.js` + `assets/js/views/progress-view.js` | Thanh tiến trình động và nút hoàn tất thủ công. |
| `vue/stores/restaurantStore.js` state + local component state | `assets/js/models/*-state.js` | State miền nghiệp vụ được quản lý qua store ở Vue và theo class ở plain JS. |

## Từ Vựng Dùng Chung

| Thao tác miền nghiệp vụ | Vue 2 | Plain JavaScript |
| --- | --- | --- |
| Thêm một bàn | `restaurantStore/addTable` qua `panel-action.vue` | `Restaurant.addTable()` và `add_table()` |
| Mở hộp chọn món cho một bàn | `table-item.js -> showMenuForTable() -> restaurantStore/setCurrentTableId` | `FoodList.showMenuFor()` và `show_menu_for()` |
| Đưa order đã gửi vào hàng đợi | `assistant.js` theo dõi `selectedFoods` và đưa vào hàng đợi cục bộ | `Assistant.addOrders()` và `add_orders()` |
| Giao một order cho chef | `assistant.js -> dispatchToChef()` -> `restaurantStore/assignOrderToChef` | `Assistant.#send_to_chef()` -> `Chef.processOrder()` |
| Cập nhật trạng thái chef/order | `restaurantStore/updateChefOrderStatus` | `Chef.processOrder()` và các private state transition |
| Lưu các món đã hoàn tất theo từng bàn | `restaurantStore/storeCompletedOrdersForTable` + watcher trong `table-item.js` | assistant completion event + `Table.receiveFood()` |
| Đăng ký nhận cập nhật từ assistant | `table-item.js -> subscribeToAssistant()` | `Table.subscribeToAssistant()` và `subscribe_to_assistant()` |
| Hủy đăng ký nhận cập nhật | `table-item.js -> unsubscribeFromAssistant()` | `Table.unsubscribeFromAssistant()` và `unsubscribe_from_assistant()` |

## Mẹo Đọc Mã

- Vue store hiện có các tên miền nghiệp vụ rõ hơn như `setCurrentTableId`, `assignOrderToChef`, `updateChefOrderStatus`, và `storeCompletedOrdersForTable`. Các alias cũ vẫn được giữ để tránh làm gãy code trước đó.
- Repo plain JavaScript hiện vẫn giữ các method `snake_case` gốc dưới dạng alias tương thích, nhưng khi đối chiếu với Vue thì các method `camelCase` là tên nên đọc trước.
- Nếu bạn muốn so sánh vòng lặp Observer cốt lõi, hãy bắt đầu từ `restaurantStore.js` và `assistant.js` ở Vue, sau đó đọc `Restaurant` và `Assistant` ở [dự án plain JavaScript](https://github.com/dangkhoa2016/Observer-Pattern-Restaurant).
