# RIA_REVIEW_STATUS_BOARD_UI_1

Local candidate: synchronizes the upstream generic `ReviewStatusBoardPanel` then binds it only to the RIA review broker, GitHub session identity, short-lived review-archive download, Relay parser, and map workspace. The RIA `ReviewModule` is now a thin binding and retains no generic status-board or release-control UI logic. It preserves the first `保存 / 通过 / 打回` row and inserts only `归档 / 要求修改 / 恢复待审` before the existing `临挂 / 导出 / 删除` row.

Validation: production build, auth route test, review-package contract test and project configuration validation passed.
