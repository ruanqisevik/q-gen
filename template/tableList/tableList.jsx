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

import styles from './{{class}}.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ {{#each modules}}{{this}}, {{/each}}loading }) => ({
  {{#each modules}}
  {{this}},
  {{/each}}
  loading: {{#each modules}}{{#if @index}} && {{/if}}loading.models.{{this}}{{/each}}
}))
@Form.create()

class {{class}} extends PureComponent {
  /**
   * definition
   */
  state = {
    expandForm: false,
    selectedRows: [],
  };

  columns = {{{columns}}}

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

    {{#each modules}}
    dispatch({
      type: 'request/{{this}}',
      payload: options,
    });
    {{/each}}
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
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    this.fetchList(params);
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.fetchList()
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
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

  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      this.fetchList(values)
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter=\{{ md: 8, lg: 24, xl: 48 }}>
          {{#each form}}
          {{#if @index}}
          {{else}}
          <Col md={8} sm={24}>
            <FormItem label="{{label this}}">
              {getFieldDecorator('{{key this}}')(   
                {{#if format}}
                <DatePicker style=\{{ width: '100%' }} {{#isTime format}}showTime=\{{ format: 'HH:mm' }}{{/isTime}} placeholder="请输入更新日期" /> 
                {{else}}
                {{#if enum}}
                <Select placeholder="请选择" style=\{{ width: '100%' }}>
                  {{#each enum}}
                  <Option value="{{this}}">{{this}}</Option>
                  {{/each}}
                </Select>
                {{else}}
                <Input placeholder="请输入" />
                {{/if}}
                {{/if}}
              )}
            </FormItem>
          </Col>
          {{/if}}
          {{/each}}

          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style=\{{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            <a style=\{{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter=\{{ md: 8, lg: 24, xl: 48 }}>
        {{#each form}}
          <Col md={8} sm={24}>
            <FormItem label="{{label this}}">
              {getFieldDecorator('{{key this}}')(   
                {{#if format}}
                <DatePicker style=\{{ width: '100%' }} {{#isTime format}}showTime=\{{ format: 'HH:mm' }}{{/isTime}} placeholder="请输入更新日期" /> 
                {{else}}
                {{#if enum}}
                <Select placeholder="请选择" style=\{{ width: '100%' }}>
                  {{#each enum}}
                  <Option value="{{this}}">{{this}}</Option>
                  {{/each}}
                </Select>
                {{else}}
                <Input placeholder="请输入" />
                {{/if}}
                {{/if}}
              )}
            </FormItem>
          </Col>
        {{#wrapRow @index}}
        </Row>
        <Row gutter=\{{ md: 8, lg: 24, xl: 48 }}>
        {{/wrapRow}} 
        {{/each}}
        </Row>
        <div style=\{{ overflow: 'hidden' }}>
          <div style=\{{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style=\{{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style=\{{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  /**
   * renders
   */
  render() {
    const {
      {{#each modules}}
      {{this}},
      {{/each}}
      loading,
    } = this.props;
    /**
    * process list data from request modules response
    */
    {{#isSingleModule modules}}
    const { data } = {{this}}
    {{else}}
    const data = []
    {{/isSingleModule}}
    
    const { selectedRows } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    return (
      <PageHeaderWrapper title="{{title}}">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              {{#if addable}}
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {{/if}}
              {{#if batch}}
              {selectedRows.length > 0 && (
                <span>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
              {{/if}}
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

export default {{class}};
