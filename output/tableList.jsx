import React, { PureComponent, Fragment } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import Link from 'umi/link'
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
} from 'antd'
import StandardTable from '@/components/StandardTable'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'

import styles from './TableList.less'

const FormItem = Form.Item
const { Step } = Steps
const { TextArea } = Input
const { Option } = Select
const RadioGroup = Radio.Group
const getValue = obj =>
	Object.keys(obj)
		.map(key => obj[key])
		.join(',')

/* eslint react/no-multi-comp:0 */
@connect(({ adminGoodsCategory, loading }) => ({
	adminGoodsCategory,
	loading: loading.models.adminGoodsCategory,
}))
@Form.create()
class TableList extends PureComponent {
	/**
	 * definition
	 */
	state = {
		expandForm: false,
		selectedRows: [],
	}

	columns = [
		{ title: '主键', dataIndex: 'id' },
		{ title: '父分类ID', dataIndex: 'fid' },
		{ title: '名称', dataIndex: 'name' },
		{ title: '商品分类级别', dataIndex: 'level' },
		{
			title: '状态(1有效，0删除)',
			dataIndex: 'status',
			filters: [{ text: 0, value: 0 }, { text: 1, value: 1 }],
		},
		{ title: '记录创建时间', dataIndex: 'createTime' },
		{ title: '创建人id', dataIndex: 'createById' },
		{ title: '修改人id', dataIndex: 'modifyById' },
		{ title: '记录修改时间', dataIndex: 'modifyTime' },
	]

	/**
	 * life cycle
	 */
	componentDidMount() {
		this.fetchList()
	}

	/**
	 * networks
	 */
	fetchList = options => {
		const { dispatch } = this.props

		dispatch({
			type: 'request/adminGoodsCategory',
			payload: options,
		})
	}

	/**
	 * listeners
	 */

	/**
	 * handlers
	 */
	handleStandardTableChange = (pagination, filtersArg, sorter) => {
		const filters = Object.keys(filtersArg).reduce((obj, key) => {
			const newObj = { ...obj }
			newObj[key] = getValue(filtersArg[key])
			return newObj
		}, {})

		const params = {
			page: pagination.current,
			pageSize: pagination.pageSize,
			...filters,
		}
		if (sorter.field) {
			params.sorter = `${sorter.field}_${sorter.order}`
		}

		this.fetchList(params)
	}

	handleFormReset = () => {
		const { form, dispatch } = this.props
		form.resetFields()
		this.setState({
			formValues: {},
		})
		this.fetchList()
	}

	toggleForm = () => {
		const { expandForm } = this.state
		this.setState({
			expandForm: !expandForm,
		})
	}

	handleMenuClick = e => {
		const { selectedRows } = this.state
		if (selectedRows.length === 0) return
		switch (e.key) {
			case 'remove':
				break
			default:
				break
		}
	}

	handleSelectRows = rows => {
		this.setState({
			selectedRows: rows,
		})
	}

	handleSearch = e => {
		e.preventDefault()

		const { form } = this.props

		form.validateFields((err, fieldsValue) => {
			if (err) return

			const values = {
				...fieldsValue,
				updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
			}

			this.setState({
				formValues: values,
			})

			this.fetchList(values)
		})
	}

	renderSimpleForm() {
		const {
			form: { getFieldDecorator },
		} = this.props
		return (
			<Form onSubmit={this.handleSearch} layout="inline">
				<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
					<Col md={8} sm={24}>
						<FormItem label="主键">
							{getFieldDecorator('id')(<Input placeholder="请输入" />)}
						</FormItem>
					</Col>

					<Col md={8} sm={24}>
						<span className={styles.submitButtons}>
							<Button type="primary" htmlType="submit">
								查询
							</Button>
							<Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
								重置
							</Button>
							<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
								展开 <Icon type="down" />
							</a>
						</span>
					</Col>
				</Row>
			</Form>
		)
	}

	renderAdvancedForm() {
		const {
			form: { getFieldDecorator },
		} = this.props
		return (
			<Form onSubmit={this.handleSearch} layout="inline">
				<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
					<Col md={8} sm={24}>
						<FormItem label="主键">
							{getFieldDecorator('id')(<Input placeholder="请输入" />)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem label="父分类ID">
							{getFieldDecorator('fid')(<Input placeholder="请输入" />)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem label="名称">
							{getFieldDecorator('name')(<Input placeholder="请输入" />)}
						</FormItem>
					</Col>
				</Row>
				<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
					<Col md={8} sm={24}>
						<FormItem label="商品分类级别">
							{getFieldDecorator('level')(<Input placeholder="请输入" />)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem label="状态(1有效，0删除)">
							{getFieldDecorator('status')(
								<Select placeholder="请选择" style={{ width: '100%' }}>
									<Option value="0">0</Option>
									<Option value="1">1</Option>
								</Select>
							)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem label="记录创建时间">
							{getFieldDecorator('createTime')(
								<DatePicker
									style={{ width: '100%' }}
									showTime={{ format: 'HH:mm' }}
									placeholder="请输入更新日期"
								/>
							)}
						</FormItem>
					</Col>
				</Row>
				<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
					<Col md={8} sm={24}>
						<FormItem label="创建人id">
							{getFieldDecorator('createById')(<Input placeholder="请输入" />)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem label="修改人id">
							{getFieldDecorator('modifyById')(<Input placeholder="请输入" />)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem label="记录修改时间">
							{getFieldDecorator('modifyTime')(
								<DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" />
							)}
						</FormItem>
					</Col>
				</Row>
				<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
					<Col md={8} sm={24}>
						<FormItem label="删除标志">
							{getFieldDecorator('deleted')(<Input placeholder="请输入" />)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem label="页码">
							{getFieldDecorator('pageNum')(<Input placeholder="请输入" />)}
						</FormItem>
					</Col>
					<Col md={8} sm={24}>
						<FormItem label="每页数据量">
							{getFieldDecorator('pageSize')(<Input placeholder="请输入" />)}
						</FormItem>
					</Col>
				</Row>
				<Row gutter={{ md: 8, lg: 24, xl: 48 }} />
				<div style={{ overflow: 'hidden' }}>
					<div style={{ float: 'right', marginBottom: 24 }}>
						<Button type="primary" htmlType="submit">
							查询
						</Button>
						<Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
							重置
						</Button>
						<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
							收起 <Icon type="up" />
						</a>
					</div>
				</div>
			</Form>
		)
	}

	renderForm() {
		const { expandForm } = this.state
		return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm()
	}

	/**
	 * renders
	 */
	render() {
		const { adminGoodsCategory, loading } = this.props
		/**
		 * process list data from request modules response
		 */
		const { data } = adminGoodsCategory

		const { selectedRows } = this.state
		const menu = (
			<Menu onClick={this.handleMenuClick} selectedKeys={[]}>
				<Menu.Item key="remove">删除</Menu.Item>
				<Menu.Item key="approval">批量审批</Menu.Item>
			</Menu>
		)

		return (
			<PageHeaderWrapper title="table list title">
				<Card bordered={false}>
					<div className={styles.tableList}>
						<div className={styles.tableListForm}>{this.renderForm()}</div>
						<div className={styles.tableListOperator}>
							<Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
								新建
							</Button>
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
		)
	}
}

export default TableList
