import React from 'react'
import moment from 'moment'
import { Button, Popconfirm, message, Form, Row, Col, Tree } from 'antd'
const TreeNode = Tree.TreeNode
import OBOREdit from '../../../../../components/OBOREdit'
import { OperationType } from '../../../../../constants/Status'

class AuthorityEdit extends React.Component {
    static propTypes = {
        form: React.PropTypes.object,
        params: React.PropTypes.object,
        AuthorityEdit: React.PropTypes.object,
        clearState: React.PropTypes.func,
        getAuthById: React.PropTypes.func,
        createAuth: React.PropTypes.func,
        updateAuth: React.PropTypes.func,
        getOperations: React.PropTypes.func,
        getMenus: React.PropTypes.func
    }
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }
    constructor(props) {
        super(props)
        const { params: { id } } = props
        this.id = id
    }
    state = {
        menus: [],
        menusCheckedKeys: [],
        selectedKeys: [],
        expandedKeys: [],
        operationTypes: [],
        operations: [],
        selectedOperations: [],
        detail: {},
        disabled:false,
        autoExpandParent:false,
        create:{},
        update:{}
    }
    componentWillMount() {
        this.props.getMenus()
        this.props.getOperations()
        if (this.id) {
            this.props.getAuthById(this.id)
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.AuthorityEdit.detail) {
            const detail = nextProps.AuthorityEdit.detail
            const selectedOperations = []
            const menusCheckedKeys = []
            detail.AuthOperation = detail.AuthOperation || []
            detail.AuthMenu = detail.AuthMenu || []
            detail.AuthOperation.map((item) => {
                selectedOperations.push(item.id)
            })
            detail.AuthMenu.map((item) => {
                menusCheckedKeys.push(item.id.toString())
            })
            this.setState({ detail, menusCheckedKeys, selectedOperations, expandedKeys:menusCheckedKeys })
            this.props.clearState()
        }
        if (nextProps.AuthorityEdit.menus) {
            const menus = nextProps.AuthorityEdit.menus
            const firstMenu = menus.filter((item) => item.parent_id === 0)
            firstMenu.map((item, i) => {
                this.setMenusData(item.id, item, menus)
            })
            this.setState({ menus:firstMenu, menusCheckedKeys:[] })
            console.log('ss', firstMenu)
            this.props.clearState()
        }
        if (nextProps.AuthorityEdit.operations) {
            const list = nextProps.AuthorityEdit.operations.content
            const operations = []
            list.map((item) => {
                operations.push({
                    label:item.name, value:item.id
                })
            })
            this.setState({ operations })
            this.props.clearState()
        }
        if (nextProps.AuthorityEdit.update) {
            message.success('????????????')
            this.context.router.push('/authorityList')
            this.props.clearState()
        }
        if (nextProps.AuthorityEdit.create) {
            message.success('????????????')
            this.context.router.push('/authorityList')
            this.props.clearState()
        }
        if (nextProps.AuthorityEdit.error) {
            message.error(nextProps.AuthorityEdit.error.error)
            this.props.clearState()
        }
    }
    setMenusData = (id, firstMenu, menus) => {
        const find = menus.filter((v) => {
            return id === v.parent_id
        })
        if (find.length) {
            find.map((f) => {
                f.key = `${id}-${f.id}`
                firstMenu.child = find
                this.setMenusData(f.id, f, menus)
            })
        }
    }
    onTreeSelect = (selectedKeys, info) => {
        console.log('select', selectedKeys)
        this.setState({ selectedKeys })
    }
    onTreeCheck = (checkedKeys, info) => {
        this.setState({ menusCheckedKeys:checkedKeys })
    }
    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false
        })
    }
    render() {
        // const { getFieldDecorator } = this.props.form
        const detail = this.state.detail || {}
        const options = [
            {
                type:'text',
                rules:[{ required:true, message:'?????????' }],
                fieldLabel:'????????????',
                disabled:this.id === '1' || false,
                fieldName:'name',
                placeholder:'?????????',
                initialValue:detail.name,
                onChange:() => {}
            },
            {
                type:'select', // ????????????
                option:{ // ????????????
                    valueField:'id', // ??????value??????
                    textField:'name', // ??????text??????
                    placeholder:'????????????', // ????????????
                    options: [{ id:'ENABLED', name:'??????' }, { id:'DISABLED', name:'??????' }], // ?????????option?????? (array)
                    selected: detail.status || 'ENABLED' // ???????????????value[string]???
                },
                disabled:this.id === '1' || false,
                fieldLabel:'??????', // ??????label
                fieldName:'status' // ???????????????
            },
            {
                type:'checkboxGroup',
                rules:[{ required:true, message:'?????????' }],
                option:{
                    valueField:'value',
                    textField:'label',
                    placeholder:'??????????????????',
                    options:this.state.operations,
                    selected:this.state.selectedOperations,
                    onChange:(val) => {}
                },
                disabled:this.id === '1' || false,
                fieldLabel:'????????????',
                fieldName:'operationGroup'
            }
        ]
        return (
            <div className="page-container page-detail">
                <div className="page-top-btns">
                    {
                        this.id !== '1' ?
                            <Button type="primary" onClick={(e) => { this.save(e) }}>??????</Button> :
                            ''
                    }
                </div>
                <div style={{ width: '50%' }}>
                    <OBOREdit options={options} colSpan={24} ref="OBOREdit1" />
                </div>
                <Row>
                    <Col offset={3} span={1} >?????????</Col>
                    <Col span={12}>
                        <div style={{ marginTop:'-10px' }}>
                            <Tree checkable
                              onExpand={this.onExpand} expandedKeys={this.state.expandedKeys}
                              autoExpandParent={this.state.autoExpandParent}
                              onCheck={this.onTreeCheck} checkedKeys={this.state.menusCheckedKeys}
                              onSelect={this.onTreeSelect} selectedKeys={this.state.selectedKeys} >
                                {this._renderTreeNode(this.state.menus)}
                            </Tree>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
    _renderTreeNode = (menus) => {
        return menus.map((item) => {
            if (item.child) {
                return (
                    <TreeNode title={item.name} key={item.id} disabled={this.id === '1' || false}>
                        {this._renderTreeNode(item.child)}
                    </TreeNode>
                )
            } else {
                return <TreeNode title={item.name} key={item.id} disabled={this.id === '1' || false} />
            }
        })
    }
    save = (e) => {
        this.refs.OBOREdit1.handleValidator(e, (value) => {
            value.operation_ids = value.operationGroup.join(',')
            value.menu_ids = this.state.menusCheckedKeys.join(',')
            delete value.operationGroup
            if (!this.id) {
                this.props.createAuth(value)
            } else {
                value.id = this.id
                this.props.updateAuth(value)
            }
        })
    }
}

export default Form.create()(AuthorityEdit)
