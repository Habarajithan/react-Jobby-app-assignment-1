import {Component} from 'react'
import {Link} from 'react-router-dom'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {IoSearch, IoStar, IoLocation} from 'react-icons/io5'

import {FaBriefcase} from 'react-icons/fa'

import Header from '../Header'

import './index.css'

class Jobs extends Component {
  state = {
    profileDetails: {},
    jobDetails: [],
    filteredJobsList: [],
    searchInputValue: '',
    employmentType: [],
    salaryRange: '',
    isProfileLoading: true,
    isJobDetailsLoading: true,
    isProfileFailure: false,
    isJobDetailsFailure: false,
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobDetails()
  }

  getProfileDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      console.log(data)

      const updatedProfileDetails = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }

      this.setState({
        profileDetails: updatedProfileDetails,
        isProfileLoading: false,
        isProfileFailure: false,
      })
    } else {
      this.setState({
        isProfileFailure: true,
        isProfileLoading: false,
      })
    }
  }

  getJobDetails = async () => {
    this.setState({
      isJobDetailsLoading: true,
      isJobDetailsFailure: false,
    })
    const {searchInputValue, employmentType, salaryRange} = this.state

    const jwtToken = Cookies.get('jwt_token')

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType.join(
      ',',
    )}&minimum_package=${salaryRange}&search=${searchInputValue}`
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()

      console.log(data)

      const updatedJobsDetails = data.jobs.map(i => ({
        companyLogoUrl: i.company_logo_url,
        employmentType: i.employment_type,
        id: i.id,
        jobDescription: i.job_description,
        location: i.location,
        packagePerAnnum: i.package_per_annum,
        rating: i.rating,
        title: i.title,
      }))

      this.setState({
        jobDetails: updatedJobsDetails,
        filteredJobsList: updatedJobsDetails,
        isJobDetailsLoading: false,
        isJobDetailsFailure: false,
      })
    } else {
      this.setState({
        isJobDetailsFailure: true,
        isJobDetailsLoading: false,
      })
    }
  }

  changeSearchInputValue = event => {
    this.setState({searchInputValue: event.target.value})
  }

  getUpdatedJobsDetails = () => {
    this.getJobDetails()
  }

  getEmploymentDetails = event => {
    const {value, checked} = event.target

    this.setState(
      prevState => ({
        employmentType: checked
          ? [...prevState.employmentType, value]
          : prevState.employmentType.filter(item => item !== value),
      }),
      this.getJobDetails,
    )
  }

  getSalaryRange = event => {
    this.setState({salaryRange: event.target.value}, this.getJobDetails)
  }

  renderProfileLoader = () => {
    return (
      <div className="loader-cont" data-testid="loader">
        <Loader type="ThreeDots" color="#0284c7" height={40} width={40} />
      </div>
    )
  }

  renderJobLoader = () => {
    return (
      <div className="loader-cont2" data-testid="loader">
        <Loader type="ThreeDots" color="#0284c7" height={80} width={80} />
      </div>
    )
  }

  renderFailureProfile = () => (
    <div className="failure-container">
      <h1>Something Went Wrong</h1>
      <button type="button" className="failure-btn" onClick={this.retryProfile}>
        Retry
      </button>
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" className="failure-btn" onClick={this.retryJobs}>
        Retry
      </button>
    </div>
  )

  retryProfile = () => {
    this.setState(
      {isProfileFailure: false, isProfileLoading: true},
      this.getProfileDetails,
    )
  }

  retryJobs = () => {
    this.setState(
      {isJobDetailsFailure: false, isJobDetailsLoading: true},
      this.getJobDetails,
    )
  }

  render() {
    const {
      profileDetails,
      filteredJobsList,
      searchInputValue,
      employmentType,
      salaryRange,
      isJobDetailsLoading,
      isProfileLoading,
      isProfileFailure,
      isJobDetailsFailure,
    } = this.state
    const {employmentTypesList, salaryRangesList} = this.props
    console.log(employmentType, salaryRange)

    return (
      <>
        <Header />
        <div className="jobs-bg-container">
          <div className="details-container">
            {isProfileLoading ? (
              this.renderProfileLoader()
            ) : isProfileFailure ? (
              this.renderFailureProfile()
            ) : (
              <div className="profile-container">
                <img
                  src="https://assets.ccbp.in/frontend/react-js/profile-bg.png"
                  alt=""
                  className="card"
                />
                <div className="profile-card">
                  <img
                    src={profileDetails.profileImageUrl}
                    alt="profile"
                    className="profile-logo"
                  />
                  <h1 className="profile-heading">{profileDetails.name}</h1>
                  <p className="profile-para">{profileDetails.shortBio}</p>
                </div>
              </div>
            )}
            <hr />
            <div>
              <h1 className="employment-heading">Type of Employment</h1>
              <ul>
                {employmentTypesList.map(i => (
                  <li key={i.employmentTypeId}>
                    <input
                      className="checkbox"
                      type="checkbox"
                      id={i.employmentTypeId}
                      onChange={this.getEmploymentDetails}
                      value={i.employmentTypeId}
                      checked={employmentType.includes(i.employmentTypeId)}
                    />
                    <label
                      htmlFor={i.employmentTypeId}
                      className="job-type-input-para"
                    >
                      {i.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <hr />
            <div>
              <h1 className="employment-heading">Salary Range</h1>
              <ul>
                {salaryRangesList.map(i => (
                  <li
                    key={i.salaryRangeId}
                    className="checkbox-input-container"
                  >
                    <input
                      name="salary"
                      className="checkbox"
                      type="radio"
                      id={i.salaryRangeId}
                      onChange={this.getSalaryRange}
                      value={i.salaryRangeId}
                      checked={salaryRange === i.salaryRangeId}
                    />
                    <label
                      htmlFor={i.salaryRangeId}
                      className="job-type-input-para"
                    >
                      {i.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="search-container">
            <div className="search-cont">
              <input
                value={searchInputValue}
                type="search"
                placeholder="Search"
                className="search-input"
                onChange={this.changeSearchInputValue}
              />
              <button
                type="button"
                className="search-button"
                data-testid="searchButton"
                onClick={this.getUpdatedJobsDetails}
              >
                <IoSearch />
              </button>
            </div>
            <div>
              {isJobDetailsLoading ? (
                this.renderJobLoader()
              ) : isJobDetailsFailure ? (
                this.renderFailureView()
              ) : filteredJobsList.length === 0 ? (
                <div className="no-jobs-container">
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
                    alt="no jobs"
                  />
                  <h1>No Jobs Found</h1>
                  <p>We could not find any jobs. Try other filters</p>
                </div>
              ) : (
                <ul>
                  {filteredJobsList.map(i => (
                    <li key={i.id} className="job-card">
                      <Link to={`/jobs/${i.id}`} className="link">
                        <div className="job-logo-cont">
                          <img
                            src={i.companyLogoUrl}
                            alt="company logo"
                            className="company-logo"
                          />
                          <div className="job-title-cont">
                            <h5 className="job-heading">{i.title}</h5>
                            <div className="rating-cont">
                              <IoStar className="star" />
                              <p className="rating-para">{i.rating}</p>
                            </div>
                          </div>
                        </div>
                        <div className="location-cont">
                          <div className="location">
                            <IoLocation className="location-logo" />
                            <p className="location-para">{i.location}</p>
                            <FaBriefcase className="location-logo" />
                            <p className="location-para">{i.employmentType}</p>
                          </div>
                          <p className="lpa">{i.packagePerAnnum}</p>
                        </div>
                        <hr className="job-hr" />
                        <h1 className="description">Description</h1>
                        <p className="location-para">{i.jobDescription}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </>
    )
  }
}
export default Jobs
