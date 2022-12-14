import React from 'react'
import { Button, message } from 'antd'
import moment from 'moment'
import TableGrid from '../../../../components/TableGrid'
import QueryList from '../../../../components/QueryList'
import { QuotePlanStatus, BtnOperation, genderStatus } from '../../../../constants/Status'
import BtnPermission from '../../../../components/BtnPermission'
export default class UserList extends React.Component {
    static propTypes = {
        UserList: React.PropTypes.object,
        getUserList: React.PropTypes.func,
        deleteUser: React.PropTypes.func,
        clearState: React.PropTypes.func
    }
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }
    state = {
        users: []
    }
    constructor(props) {
        super(props)
        this.pageNum = 1
        this.pageSize = 10
        this.pageTotalElement = 0
        this.query = {}
    }
    getUsers = () => {
        this.props.getUserList({ page: this.pageNum, size: this.pageSize, ...this.query })
    }
    handleSearch = (value) => {
        let _datas1 = []
        if (value.createdAt) {
            value.createdAt.forEach((data) => {
                _datas1.push(data.format('YYYY-MM-DD HH:mm:ss'))
            })
            value.createdAt = _datas1.join('|')
        }
        this.pageNum = 1
        this.query = value
        console.log('xxxxxx', this.query)
        this.getUsers()
    }
    componentWillMount() {
        this.getUsers()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.UserList.users) {
            this.pageTotalElement = nextProps.UserList.users.totalElement
            const users = nextProps.UserList.users.content
            users.map((item) => {
                item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
                item.loginTime = moment(item.loginTime).format('YYYY-MM-DD HH:mm:ss')
                item.statusName = QuotePlanStatus[item.status]
                item.genderName = genderStatus[item.gender]
            })
            this.setState({ users: users })
            this.props.clearState()
        }
        if (nextProps.UserList.delete) {
            message.success('????????????')
            this.props.clearState()
            this.getUsers()
        }
        if (nextProps.UserList.error) {
            message.error(nextProps.UserList.error.error)
            this.props.clearState()
        }
    }
    convertStatus = (statusObj) => {
        let arr = []
        Object.keys(statusObj).map((key) => {
            arr.push({ id: key, name:statusObj[key] })
        })
        return arr
    }
    render() {
        const users = this.state.users || []
        const queryOptions = [
            {
                type:'text',
                fieldLabel:'??????',
                fieldName:'nickName',
                onChange:() => {}
            },
            {
                type:'text',
                fieldLabel:'??????',
                fieldName:'email',
                initialValue:'',
                onChange:() => {}
            },
            {
                type:'select',
                option:{
                    valueField:'id',
                    textField:'name',
                    placeholder:'?????????',
                    options:this.convertStatus(QuotePlanStatus),
                    onChange:(val) => {}
                },
                fieldLabel:'??????',
                fieldName:'status'
            },
            {
                type:'rangePicker',
                initialValue:[],
                onChange:(val) => { console.log(val) },
                fieldLabel:'????????????',
                fieldName:'createdAt'
            }
        ]
        const gridColumns = [
            {
                title: '??????', // ??????
                dataIndex: 'nickName' // ????????????
            },
            {
                title: '??????', // ??????
                dataIndex: 'email' // ????????????
            },
            {
                title: '??????', // ??????
                dataIndex: 'genderName' // ????????????
            },
            {
                title: '????????????', // ??????
                dataIndex: 'createdAt' // ????????????
            },
            {
                title: '????????????', // ??????
                dataIndex: 'loginTime' // ????????????
            },
            {
                title: '??????', // ??????
                dataIndex: 'integral' // ????????????
            },
            {
                title: '??????IP', // ??????
                dataIndex: 'loginIP' // ????????????
            },
            {
                title: '??????', // ??????
                dataIndex: 'statusName' // ????????????
            },
            {
                title: '??????',
                type:'operation',
                dataIndex: 'operation',
                btns:[
                    {
                        type:'link',
                        authority:BtnOperation.??????,
                        text:'??????',
                        status:{
                            field:'status',
                            actions: []
                        },
                        onClick:(index) => { this.context.router.push('/userEdit/' + users[index].id) }
                    },
                    {
                        type:'popConfirm',
                        authority:BtnOperation.??????,
                        text:'??????',
                        title:'??????????????????',
                        onClick:(index) => {
                            this.props.deleteUser({ id:users[index].id })
                        }
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
                this.getUsers()
            },
            onChange: (current) => {
                this.pageNum = current
                this.getUsers()
            }
        }
        return (
            <div className="page-container">
                <div className="page-tabs-query">
                    <BtnPermission type={BtnOperation.??????}>
                        <Button className="page-top-btns" type="primary" onClick={() => this.context.router.push('/userEdit')}>????????????</Button>
                    </BtnPermission>
                    <div className="page-query">
                        <QueryList queryOptions={queryOptions} onSearchChange={this.handleSearch} />
                    </div>
                </div>
                <div className="page-tabs-table">
                    <TableGrid columns={gridColumns} dataSource={users}
                      pagination={pagination} />
                </div>
            </div>
        )
    }
}
