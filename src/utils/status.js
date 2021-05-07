
export const ORDER_STATUS_MAPPING = {
    confirming: {value: '待确认', type: ''},
    checking: {value: '核验中', type: ''},
    invalid: {value: '无效', type: 'info'},
    success: {value: '已生效', type: 'success'},
}

export const STOCK_STATUS_MAPPING = {
    on_saving: {value: '保存中', type: ''},
    failed_saving: {value: '保存失败', type: 'info'},
    free: {value: '可交易', type: 'success'},
    on_transaction: {value: '交易中', type: ''}
}
