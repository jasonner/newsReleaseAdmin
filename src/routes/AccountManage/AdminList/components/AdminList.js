import React from 'react'
import { Button, message, Modal } from 'antd'
import moment from 'moment'
import { CommonStatus, BtnOperation } from '../../../../constants/Status'
import TableGrid from '../../../../components/TableGrid'
import QueryList from '../../../../components/QueryList'
import OBOREdit from '../../../../components/OBOREdit'
import BtnPermission from '../../../../components/BtnPermission'

export default class AdminList extends React.Component {
    static propTypes = {
        AdminList: React.PropTypes.object,
        getAdminList: React.PropTypes.func,
        clearState: React.PropTypes.func,
        updateAdmin: React.PropTypes.func,
        createAdmin: React.PropTypes.func,
        getAuthList: React.PropTypes.func,
        deleteAdmin: React.PropTypes.func
    }
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }
    state = {
        admins: [],
        auths: [],
        create:{},
        update:{},
        newRandomKeys:Math.random(),
        modalVisible:false,
        AdminOne:null
    }
    constructor(props) {
        super(props)
        this.pageNum = 1
        this.pageSize = 10
        this.pageTotalElement = 0
        this.query = {}
    }
    getAdmins = () => {
        this.props.getAdminList({ page: this.pageNum, size: this.pageSize, ...this.query })
    }
    handleSearch = (value) => {
        let _data1 = []
        if (value.createdAt) {
            value.createdAt.forEach((data) => {
                _data1.push(data.format('YYYY-MM-DD HH:mm:ss'))
            })
            value.createdAt = _data1.join('|')
        }
        this.pageNum = 1
        this.query = value
        this.getAdmins()
    }
    componentWillMount() {
        this.getAdmins()
        this.props.getAuthList()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.AdminList.admins) {
            this.pageTotalElement = nextProps.AdminList.admins.totalElement
            const admins = nextProps.AdminList.admins.content
            admins.map((item) => {
                item.loginTime = moment(item.loginTime).format('YYYY-MM-DD HH:mm:ss')
                item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
                item.statusName = CommonStatus[item.status]
            })
            this.setState({ admins: admins })
            this.props.clearState()
        }
        if (nextProps.AdminList.auths) {
            console.log('sss', nextProps.AdminList.auths)
            this.setState({ auths:nextProps.AdminList.auths.content })
            this.props.clearState()
        }
        if (nextProps.AdminList.error) {
            message.error(nextProps.AdminList.error.error)
            this.props.clearState()
        }
        if (nextProps.AdminList.update) {
            message.success('????????????')
            this.setState({ modalVisible:false })
            this.getAdmins()
            this.props.clearState()
        }
        if (nextProps.AdminList.create) {
            message.success('????????????')
            this.setState({ modalVisible:false })
            this.getAdmins()
            this.props.clearState()
        }
        if (nextProps.AdminList.delete) {
            this.props.clearState()
            message.success('????????????')
            this.getAdmins()
        }
    }
    translateStatus = (status) => {
        return Object.keys(status).map((key) => {
            return ({ id:key, name:status[key] })
        })
    }
    render() {
        const admins = this.state.admins || []
        const AdminOne = this.state.AdminOne || {}
        const queryOptions = [
            {
                type:'text',
                fieldLabel:'?????????',
                fieldName:'adminName',
                initialValue:'',
                onChange:() => {}
            },
            {
                type:'email',
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
                    options:this.state.auths,
                    selected:'',
                    onChange:(val) => {}
                },
                fieldLabel:'??????',
                fieldName:'auth_id'
            },
            {
                type:'select',
                option:{
                    valueField:'id',
                    textField:'name',
                    placeholder:'?????????',
                    options:this.translateStatus(CommonStatus),
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
                title: '?????????', // ??????
                dataIndex: 'adminName' // ????????????
            },
            {
                title: '??????', // ??????
                dataIndex: 'email' // ????????????
            },
            {
                title: '??????', // ??????
                dataIndex: 'Auth.name' // ????????????
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
                        onClick:(index) => {
                            this.setState({ modalVisible:true, AdminOne: admins[index], newRandomKeys:Math.random() })
                        }
                    },
                    {
                        type:'popConfirm',
                        authority:BtnOperation.??????,
                        text:'??????',
                        title:'??????????????????',
                        onClick:(index) => {
                            this.props.deleteAdmin({ id:admins[index].id })
                        }
                    }
                ]
            }
        ]
        console.log('aaa', AdminOne.authId)
        const modalOption = [
            {
                type:'text',
                rules:[{ required:true, message:'??????????????????' }],
                fieldLabel:'?????????',
                fieldName:'adminName',
                initialValue:AdminOne.adminName,
                onChange:() => {}
            },
            {
                type:'text',
                rules:[{ required:true, message:'???????????????' }, { type: 'email', message: '????????????????????????' }],
                fieldLabel:'??????',
                fieldName:'email',
                initialValue:AdminOne.email,
                onChange:() => {}
            },
            {
                type:'password',
                rules:[{ required:true, message:'???????????????' }, { validate:'reg=^.{6,}$', message:'?????????6???????????????' }],
                fieldLabel:'??????',
                fieldName:'password',
                initialValue:'',
                onChange:() => {}
            },
            {
                type:'select',
                rules:[{ required:true, message:'???????????????' }],
                option:{
                    valueField:'id',
                    textField:'name',
                    placeholder:'??????',
                    options:this.state.auths,
                    selected:AdminOne.authId,
                    onChange:(val) => {}
                },
                fieldLabel:'??????',
                fieldName:'auth_id'
            },
            {
                type:'select',
                rules:[{ required:true, message:'???????????????' }],
                option:{
                    valueField:'id',
                    textField:'name',
                    placeholder:'????????????',
                    options:this.translateStatus(CommonStatus),
                    selected:AdminOne.status,
                    onChange:(val) => {}
                },
                fieldLabel:'??????',
                fieldName:'status'
            }
        ]
        if (this.state.AdminOne) {
            modalOption[2].fieldLabel = '????????????'
            modalOption[2].rules = [{ validate:'reg=^.{6,}$', message:'?????????6???????????????' }]
            modalOption.splice(3, 0, {
                type:'text',
                rules:[{ validate:'reg=^.{6,}$', message:'?????????6???????????????' }],
                fieldLabel:'?????????',
                fieldName:'new_password',
                initialValue:'',
                onChange:() => {}
            })
        }
        const pagination = {
            total: this.pageTotalElement,
            showSizeChanger: true,
            current: this.pageNum,
            onShowSizeChange: (current, pageSize) => {
                this.pageSize = pageSize
                this.pageNum = current
                this.getAdmins()
            },
            onChange: (current) => {
                this.pageNum = current
                this.getAdmins()
            }
        }
        return (
            <div className="page-container">
                <div className="page-tabs-query">
                    <BtnPermission type={BtnOperation.??????}>
                        <Button className="page-top-btns" type="primary" onClick={() => { this.setState({ modalVisible:true, newRandomKeys:Math.random(), AdminOne: null }) }}>????????????</Button>
                    </BtnPermission>
                    <div className="page-query">
                        <QueryList queryOptions={queryOptions} onSearchChange={this.handleSearch} />
                    </div>
                </div>
                <div className="page-tabs-table">
                    <TableGrid columns={gridColumns} dataSource={admins}
                      pagination={pagination} />
                </div>
                <Modal key={this.state.newRandomKeys} title="????????????" visible={this.state.modalVisible} width="40%" onCancel={() => { this.setState({ modalVisible:false }) }}
                  footer={[<Button key="back" type="primary" size="large" onClick={(e) => this.save(e)}>??????</Button>]} >
                    <OBOREdit ref="OBOREdit1" colSpan={24} options={modalOption} />
                </Modal>
            </div>
        )
    }
    save = (e) => {
        this.refs.OBOREdit1.handleValidator(e, (value1) => {
            console.log('vvvvvvv', this.state.AdminOne)
            if (this.state.AdminOne) {
                value1.id = this.state.AdminOne.id
                this.props.updateAdmin(value1)
            } else {
                this.props.createAdmin(value1)
            }
        })
    }
}
