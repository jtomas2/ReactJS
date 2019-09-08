import React from "react";
import logger from "sabio-debug";
import * as dateService from "../../services/dateService";
import "./EventStyle.css";
import PropTypes from "prop-types";
import * as eventService from "../../services/eventService";
import { Redirect } from "react-router-dom";
import swal from "sweetalert";
import LocationMap from "../location/LocationMap";
const _logger = logger.extend("EventView");

class EventView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      event: {
        id: "",
        eventType: "",
        name: "",
        shortDescription: "",
        summary: "",
        venue: "",
        eventStatus: "",
        imageUrl: "",
        externalSiteUrl: "",
        isFree: "",
        dateStart: "",
        dateEnd: "",
        address: {
          center: {
            lat: 0,
            lng: 0
          },
          address: ""
        }
      },
      redirect: false,
      collapse: false
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;

    eventService
      .getById(id)
      .then(this.onGetByIdSuccess)
      .catch(this.onGetByIdError);
  }

  onGetByIdSuccess = response => {
    _logger("Get by Id Success");

    const event = response.item;
    this.setState({
      event: {
        id: event.id,
        eventType: event.eventType.name,
        name: event.name,
        shortDescription: event.shortDescription,
        summary: event.summary,
        venue: event.eventVenues.name,
        lineOne: event.eventVenues.eventLocation.lineOne,
        city: event.eventVenues.eventLocation.city,
        zip: event.eventVenues.eventLocation.zip,
        latitude: event.eventVenues.eventLocation.latitude,
        longitute: event.eventVenues.eventLocation.longitute,
        eventStatus: event.eventStatus.name,
        imageUrl: event.imageUrl,
        externalSiteUrl: event.externalSiteUrl,
        isFree: event.isFree,
        dateStart: event.dateStart,
        dateEnd: event.dateEnd,
        address: {
          center: {
            lat: event.eventVenues.eventLocation.latitude,
            lng: event.eventVenues.eventLocation.longitude
          },
          address: event.eventVenues.eventLocation.lineOne
        }
      },
      collapse: false
    });
  };

  onGetByIdError = () => {
    swal({
      title: "Oops",
      text: "The event with this ID could not be found.",
      type: "warning",
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Okay",
      buttons: true,
      dangerMode: true
    }).then(this.setState({ redirect: true }));

    _logger("Get by Id error");
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/admin/events" />;
    }
  };

  toggle = () => {
    this.setState(prevState => ({
      ...prevState,
      collapse: !prevState.collapse
    }));
  };

  render() {
    _logger("Rendering event component");
    return (
      <React.Fragment>
        <div>{this.renderRedirect()}</div>
        <div className="container">
          <div className="content-wrapper container-fluid">
            <div className="row eventRow">
              <div className="col-md-8">
                <div className="card eventCard b">
                  <div className="card-header">
                    <h4 className="my-2">
                      <span>{this.state.event.name}</span>
                    </h4>
                  </div>
                  <div className="card-body bb bt eventBackground">
                    <img
                      className="img-fluid rounded pull-right"
                      style={{ width: "100%", height: "300px" }}
                      src={
                        this.state.event.imageUrl
                          ? this.state.event.imageUrl
                          : "https://image.freepik.com/free-vector/retro-bicycle_23-2147514491.jpg"
                      }
                      alt="eventPic"
                    />
                  </div>
                  <div className="card-body eventBackground">
                    <div className="col-md-12">
                      <div className="badge badge-primary">
                        {this.state.event.eventType}
                      </div>

                      <a
                        className="btn btn-dark float-right"
                        href={this.state.event.externalSiteUrl}
                      >
                        Website
                      </a>
                    </div>
                    <div className="card-body">
                      <div className="text-center">
                        <strong>
                          <h3>{this.state.event.name}</h3>
                        </strong>
                      </div>
                      <h4>Summary</h4>
                      <p>{this.state.event.summary}</p>
                      {this.state.collapse === true ? (
                        <div>
                          <h4>Description</h4>
                          <div>
                            <div>{this.state.event.shortDescription}</div>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <div className="card-body text-center">
                      <button
                        onClick={this.toggle}
                        className="btn btn-light btn-oval px-5 py-0"
                        type="button"
                      >
                        {this.state.collapse === true
                          ? "Read Less"
                          : "Read More"}
                      </button>
                    </div>

                    <div />
                  </div>
                </div>
              </div>
              <span className="col-md-4">
                <div className="card-default card">
                  <div className="card-body">
                    <table className="table table-hover">
                      <tbody>
                        <tr>
                          <td>Date</td>
                          <td>
                            {dateService.formatDate(this.state.event.dateStart)}
                          </td>
                        </tr>
                        <tr>
                          <td>Time</td>
                          <td>
                            {dateService.formatTime(this.state.event.dateEnd)}
                          </td>
                        </tr>
                        <tr>
                          <td>Free</td>
                          <td>{this.state.event.isFree ? "Yes" : "No"}</td>
                        </tr>
                        <tr>
                          <td>Venue</td>
                          <td>{this.state.event.venue}</td>
                        </tr>
                        <tr>
                          <td>Address</td>
                          <td>
                            {this.state.event.lineOne}
                            {","}
                            <div>
                              {this.state.event.city}
                              {", "}
                              {this.state.event.zip}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="card-default card">
                  <div className="card-body">
                    <LocationMap address={this.state.event.address} />
                  </div>
                </div>
              </span>
            </div>
          </div>
        </div>
        <div />
      </React.Fragment>
    );
  }
}

EventView.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  })
};

export default EventView;
