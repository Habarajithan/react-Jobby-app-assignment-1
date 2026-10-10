import {Component} from 'react'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {IoStar, IoLocation} from 'react-icons/io5'
import {FaExternalLinkAlt, FaBriefcase} from 'react-icons/fa'

import Header from '../Header'

import './index.css'

class JobItemDetails extends Component {
  state = {
    jobDetails: {
      companyLogoUrl: '',
      companyWebsiteUrl: '',
      employmentType: '',
      id: '',
      jobDescription: '',
      lifeAtCompany: {
        description: '',
        imageUrl: '',
      },
      location: '',
      packagePerAnnum: '',
      rating: '',
      skills: [],
      title: '',
    },
    similarJobs: [],
    isLoading: true,
    isFailure: false,
  }

  componentDidMount() {
    this.getJobsDetails()
  }

  getJobsDetails = async () => {
    this.setState({
      isLoading: true,
      isFailure: false,
    })

    const {id} = this.props.match.params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()
      const jobs = data.job_details

      const updatedJobDetails = {
        companyLogoUrl: jobs.company_logo_url,
        companyWebsiteUrl: jobs.company_website_url,
        employmentType: jobs.employment_type,
        id: jobs.id,
        jobDescription: jobs.job_description,
        lifeAtCompany: {
          description: jobs.life_at_company.description,
          imageUrl: jobs.life_at_company.image_url,
        },
        location: jobs.location,
        packagePerAnnum: jobs.package_per_annum,
        rating: jobs.rating,
        skills: jobs.skills.map(i => ({
          name: i.name,
          imageUrl: i.image_url,
        })),
        title: jobs.title,
      }

      const updatedSimilarJobs = data.similar_jobs.map(i => ({
        id: i.id,
        title: i.title,
        companyLogoUrl: i.company_logo_url,
        location: i.location,
        employmentType: i.employment_type,
        packagePerAnnum: i.package_per_annum,
        rating: i.rating,
        jobDescription: i.job_description,
      }))

      this.setState({
        jobDetails: updatedJobDetails,
        similarJobs: updatedSimilarJobs,
        isLoading: false,
        isFailure: false,
      })
    } else {
      this.setState({
        isLoading: false,
        isFailure: true,
      })
    }
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.retryJobs}>
        Retry
      </button>
    </div>
  )

  retryJobs = () => {
    this.getJobsDetails()
  }

  render() {
    const {jobDetails, similarJobs, isLoading, isFailure} = this.state

    return (
      <>
        <Header />
        {isLoading ? (
          this.renderLoader()
        ) : isFailure ? (
          this.renderFailureView()
        ) : (
          <div className="jobs-container-final">
            <div className="job-card">
              <div className="job-logo-cont">
                <img
                  src={jobDetails.companyLogoUrl}
                  alt="job details company logo"
                  className="company-logo"
                />

                <div className="job-title-cont">
                  <h5 className="job-heading">{jobDetails.title}</h5>

                  <div className="rating-cont">
                    <IoStar className="star" />
                    <p className="rating-para">{jobDetails.rating}</p>
                  </div>
                </div>
              </div>

              <div className="location-cont">
                <div className="location">
                  <IoLocation className="location-logo" />
                  <p className="location-para">{jobDetails.location}</p>

                  <FaBriefcase className="location-logo" />
                  <p className="location-para">{jobDetails.employmentType}</p>
                </div>

                <p className="lpa">{jobDetails.packagePerAnnum}</p>
              </div>

              <hr className="job-hr" />

              <div className="description-container">
                <h1 className="description">Description</h1>

                <a
                  href={jobDetails.companyWebsiteUrl}
                  className="link-to-website"
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit
                  <FaExternalLinkAlt className="fa" />
                </a>
              </div>

              <p className="location-para des">{jobDetails.jobDescription}</p>

              <div className="skill-container">
                <h1>Skills</h1>
                <ul className="skill-cont">
                  {jobDetails.skills.map(i => (
                    <li key={i.name} className="skill-card">
                      <img
                        src={i.imageUrl}
                        alt={i.name}
                        className="skill-logo"
                      />

                      <p>{i.name}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="life-container">
                <div>
                  <h1>Life at Company</h1>
                  <p>{jobDetails.lifeAtCompany.description}</p>
                </div>

                <img
                  src={jobDetails.lifeAtCompany.imageUrl}
                  className="life-img"
                  alt="life at company"
                />
              </div>
            </div>

            <div className="similar-jobs-container">
              <h2 className="similar-head">Similar Jobs</h2>
              <ul className="jobs-list">
                {similarJobs.map(i => (
                  <li key={i.id} className="similar-card">
                    <div className="job-logo-cont">
                      <img
                        src={i.companyLogoUrl}
                        alt="similar job company logo"
                        className="company-logo"
                      />

                      <div className="job-title-cont">
                        <h1 className="job-heading">{i.title}</h1>

                        <div className="rating-cont">
                          <IoStar className="star" />
                          <p className="rating-para">{i.rating}</p>
                        </div>
                      </div>
                    </div>

                    <h1>Description</h1>

                    <p>{i.jobDescription}</p>

                    <div className="location">
                      <IoLocation className="location-logo" />
                      <p className="location-para">{i.location}</p>

                      <FaBriefcase className="location-logo" />
                      <p className="location-para">{i.employmentType}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </>
    )
  }
}

export default JobItemDetails
