module.exports = {
	title: 'this is title',
	columns: `[{
    title: '规则名称',
    dataIndex: 'name',
    render: text => \`\${text}\`,
    }, {
    title: '描述',
    dataIndex: 'desc',
    }, {
    title: '服务调用次数',
    dataIndex: 'callNo',
    sorter: true,
    render: val => \`\${val}
      万 \`,
    needTotal: true,
    }, {
    title: '状态',
    dataIndex: 'status',
    filters: [{
        text: status[0],
        value: 0,
      },
      {
        text: status[1],
        value: 1,
      },
      {
        text: status[2],
        value: 2,
      },
      {
        text: status[3],
        value: 3,
      },
    ],
    render(val) {
      return <Badge status = {
        statusMap[val]
      }
      text = {
        status[val]
      }
      />;
    },
    }, {
    title: '上次调度时间',
    dataIndex: 'updatedAt',
    sorter: true,
    render: val => < span > {
      moment(val).format('YYYY-MM-DD HH:mm:ss')
    } < /span>,
    }, {
    title: '操作',
    render: (text, record) => ( <
      Fragment >
      <
      a > 配置 < /a> <
      Divider type = "vertical" /> <
      a href = "">订阅警报</a> < /
      Fragment >
    ),
    }, ]`
}