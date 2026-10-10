import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const logout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav>
      <ul>
        <li>
          <Link className="link" to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="main-logo"
            />
          </Link>
        </li>
      </ul>

      <ul className="nav-container">
        <Link className="link" to="/">
          <li className="link-text">Home</li>
        </Link>
        <Link className="link" to="/jobs">
          <li className="link-text">Jobs</li>
        </Link>
      </ul>
      <button type="button" className="logout-btn" onClick={logout}>
        Logout
      </button>
    </nav>
  )
}

export default withRouter(Header)
