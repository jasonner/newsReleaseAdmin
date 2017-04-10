import { connect } from 'react-redux'
import { clearState, getAuthorityList } from '../modules/authorityList'

import AuthorityList from '../components/AuthorityList'

const mapDispatchToProps = {
    clearState: () => clearState(),
    getAuthorityList: (query) => getAuthorityList(query)
}

const mapStateToProps = (state) => ({
    AuthorityList : state.AuthorityList
})

export default connect(mapStateToProps, mapDispatchToProps)(AuthorityList)
