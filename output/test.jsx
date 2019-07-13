import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import Link from 'umi/link';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './TableList.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

@Form.create()
/* eslint react/no-multi-comp:0 */
@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
class TableList extends PureComponent {
  /**
   * definition
   */
  state = {
    selectedRows: [],
  };

  columns = { title: '规则名称', dataIndex: 'name', render: text => `${text}`, }, { title: '描述', dataIndex: 'desc', }, { title: '服务调用次数', dataIndex: 'callNo', sorter: true, render: val => `${val} 万`, // mark to display a total number needTotal: true, }, { title: '状态', dataIndex: 'status', filters: [ { text: status[0], value: 0, }, { text: status[1], value: 1, }, { text: status[2], value: 2, }, { text: status[3], value: 3, }, ], render(val) { return <Badge status={statusMap[val]} text={status[val]} />; }, }, { title: '上次调度时间', dataIndex: 'updatedAt', sorter: true, render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>, }, { title: '操作', render: (text, record) => ( <Fragment> <a>配置</a> <Divider type="vertical" /> <a href="">订阅警报</a> </Fragment> ), }, ]

  /**
   * life cycle
   */
  componentDidMount() {
    this.fetchList();
  }

  /**
   * networks
   */
  fetchList = options => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
      payload: options,
    });
  };

  /**
   * listeners
   */

  /**
   * handlers
   */
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    this.fetchList(params);
  };

  handleMenuClick = e => {
    const { selectedRows } = this.state;
    if (selectedRows.length === 0) return;
    switch (e.key) {
      case 'remove':
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  /**
   * renders
   */
  render() {
    const {
      rule: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    return (
      <PageHeaderWrapper title="this is title">
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListForm}>{this.renderForm()}</div> */}
            <div className={styles.tableListOperator}>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        {/* <CreateForm {...parentMethods} modalVisible={modalVisible} /> */}
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
