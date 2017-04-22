import React from 'react'
import { Button, message } from 'antd'
import moment from 'moment'
import { QuotePlanStatus } from '../../../../constants/Status'
import TableGrid from '../../../../components/TableGrid'
import QueryList from '../../../../components/QueryList'

export default class ClassifyList extends React.Component {
    static propTypes = {
        CommentList: React.PropTypes.object,
        getCommentList: React.PropTypes.func,
        clearState: React.PropTypes.func
    }
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }
    state = {
        commentList: [],
        isClearRowKeys:false
    }
    constructor(props) {
        super(props)
        this.pageNum = 1
        this.pageSize = 10
        this.pageTotalElement = 0
        this.query = {}
    }
    getComments = () => {
        this.props.getCommentList({ page: this.pageNum, size: this.pageSize, ...this.query })
    }
    handleSearch = (value) => {
        let _datas1 = []
        if (value.createdAt) {
            value.createdTime.forEach((data) => {
                _datas1.push(data.format('x'))
            })
            value.createdTime = _datas1.join('-')
        }
        this.pageNum = 1
        this.query = value
        this.getComments()
    }
    componentWillMount() {
        this.getComments()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.CommentList.commentList) {
            this.pageTotalElement = nextProps.CommentList.commentList.totalElement
            const commentList = nextProps.CommentList.commentList
            commentList.map((item) => {
                item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
                item.statusName = QuotePlanStatus[item.status]
            })
            this.setState({ commentList: commentList })
            this.props.clearState()
        }
        if (nextProps.CommentList.error) {
            message.error(nextProps.CommentList.error.error)
            this.props.clearState()
        }
    }
    translateStatus = (status) => {
        let newStatus = []
        Object.keys(status).map((key) => {
            newStatus.push({ id:key, name:status[key] })
        })
        return newStatus
    }
    render() {
        const commentList = this.state.commentList || []
        const queryOptions = [
            {
                type:'text',
                fieldLabel:'分类名称',
                fieldName:'name',
                initialValue:'',
                onChange:() => {}
            },
            {
                type:'select',
                option:{
                    valueField:'id',
                    textField:'name',
                    placeholder:'请选择',
                    options:this.translateStatus(QuotePlanStatus),
                    // selected:plan.departureHarbor ? plan.departureHarbor.id : '',
                    onChange:(val) => {}
                },
                fieldLabel:'状态',
                fieldName:'stauts'
            },
            {
                type:'select',
                option:{
                    valueField:'id',
                    textField:'name',
                    placeholder:'请选择',
                    options:this.translateStatus(QuotePlanStatus),
                    onChange:(val) => {}
                },
                fieldLabel:'状态',
                fieldName:'status'
            },
            {
                type:'rangePicker',
                initialValue:[],
                onChange:(val) => { console.log(val) },
                fieldLabel:'创建时间',
                fieldName:'createdAt'
            }
        ]
        const gridColumns = [
            {
                title: '分类名称', // 标题
                dataIndex: 'name' // 字段名称
            },
            {
                title: '上级分类', // 标题
                dataIndex: 'parent.name' // 字段名称
            },
            {
                title: '状态', // 标题
                dataIndex: 'statusName' // 字段名称
            },
            {
                title: '导航标记', // 标题
                dataIndex: 'isNav' // 字段名称
            },
            {
                title: '序号', // 标题
                dataIndex: 'sort' // 字段名称
            },
            {
                title: '操作',
                type:'operation',
                dataIndex: 'operation',
                btns:[
                    {
                        type:'link',
                        text:'编辑',
                        status:{
                            field:'status',
                            actions: []
                        },
                        onClick:(index) => { this.context.router.push('/commentEdit/' + commentList[index].id) }
                    }
                ]
            }
        ]
        const pagination = {
            total: this.pageTotalElement,
            showSizeChanger: true,
            current: this.pageNum,
            onShowSizeChange: (current, pageSize) => {
                this.pageSize = pageSize
                this.pageNum = current
                this.getComments()
            },
            onChange: (current) => {
                this.pageNum = current
                this.getComments()
            }
        }
        return (
            <div className="page-container">
                <div className="page-tabs-query">
                    <Button className="page-top-btns" type="primary" onClick={() => this.context.router.push('/authorityEdit')}>添加权限</Button>
                    <div className="page-query">
                        <QueryList queryOptions={queryOptions} onSearchChange={this.handleSearch} />
                    </div>
                </div>
                <div className="page-tabs-table">
                    <TableGrid columns={gridColumns} dataSource={commentList} pagination={pagination} />
                </div>
            </div>
        )
    }
}