import React from "react";
import logger from "sabio-debug";
import { Formik, Field, Form } from "formik";
import DatePicker from "react-datepicker";
import eventSchema from "./EventValidation";
import PropTypes from "prop-types";
import "./EventStyle.css";
import * as eventService from "../../services/eventService";
import * as venueService from "../../services/venueService";
import swal from "sweetalert";
import "react-datepicker/dist/react-datepicker.css";
import EventVenueSearch from "./EventVenueSearch";
import * as dateService from "../../services/dateService";
const _logger = logger.extend("EventForm");

class EventForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventSchema,
      event: {
        eventTypeId: "",
        name: "",
        summary: "",
        shortDescription: "",
        venueId: "",
        eventStatusId: "",
        imageUrl: "",
        externalSiteUrl: "",
        isFree: 1,
        dateStart: new Date(),
        dateEnd: new Date(),
        id: ""
      },
      isEditing: false,
      eventTypes: [],
      eventStatus: [],
      reinitialize: true,
      editVenue: true
    };
  }

  componentDidMount() {
    this.setEventStatus();
    this.setEventTypes();
    if (this.props.match.params.id) {
      eventService
        .getById(this.props.match.params.id)
        .then(this.getByIdSuccess)
        .catch(this.getByIdError);
    }
  }

  getByIdSuccess = response => {
    let data = response.item;
    this.setState(prevState => {
      return {
        ...prevState,
        event: {
          eventTypeId: data.eventType.id,
          name: data.name,
          summary: data.summary,
          shortDescription: data.shortDescription,
          venueId: data.eventVenues.id,
          eventStatusId: data.eventStatus.id,
          imageUrl: data.imageUrl,
          externalSiteUrl: data.externalSiteUrl,
          isFree: Number(data.isFree),
          dateStart: this.dateTimeConversion(data.dateStart),
          dateEnd: this.dateTimeConversion(data.dateEnd),
          id: data.id
        },
        isEditing: true,
        editVenue: false
      };
    });
  };

  inititalizeVenue = id => {
    venueService
      .getById(id)
      .then(this.getVenueSuccess)
      .catch(this.getVenueError);
  };

  getVenueSuccess = response => {
    _logger(response);
  };

  getVenueError = () => {
    _logger("Get venue error");
  };

  getByIdError = response => {
    _logger(response, "Id was not found for editing");
  };

  dateTimeConversion = date => {
    var newDate =
      dateService.formatDate(date) + " " + dateService.formatTime(date);

    return new Date(newDate);
  };

  setEventStatus = () => {
    eventService.getStatus().then(response => {
      this.setState({
        eventStatus: response.item.map(this.mapEventStatus)
      });
    });
  };

  mapEventStatus = response => {
    return (
      <option key={response.id} value={response.id}>
        {response.name}
      </option>
    );
  };

  setEventTypes = () => {
    eventService.getTypes().then(response => {
      this.setState({
        eventTypes: response.item.map(this.mapEventTypes)
      });
    });
  };

  mapEventTypes = response => {
    return (
      <option key={response.id} value={response.id}>
        {response.name}
      </option>
    );
  };

  handleChangeStart = (date, values) => {
    this.setState(prevState => {
      return {
        ...prevState,
        event: {
          ...values,
          dateStart: date
        }
      };
    });
  };

  handleChangeEnd = (date, values) => {
    this.setState(prevState => {
      return {
        ...prevState,
        event: {
          ...values,
          dateEnd: date
        }
      };
    });
  };

  handleOptionChange = (option, values) => {
    let isFree = Number(option.target.value);
    this.setState(prevState => {
      return {
        ...prevState,
        event: {
          ...values,
          isFree
        }
      };
    });
  };

  handleSubmit = data => {
    this.setState(prevState => {
      return this.eventData(prevState, data);
    });
    if (this.state.isEditing) {
      eventService
        .update(this.state.event)
        .then(this.onHandleEditSuccess)
        .catch(this.onHandleEditError);
    } else {
      eventService
        .insert(this.state.event)
        .then(this.onHandleSubmitSuccess)
        .catch(this.onHandleSubmitError);
    }
  };

  onHandleEditSuccess = () => {
    _logger("Successfully edited event");
    swal("Successfully edited event").then(() => {
      this.props.history.push("/admin/events");
    });
  };

  onHandleEditError = () => {
    _logger("Failed to edit event");
    swal("Failed to edit event");
  };
  onHandleSubmitSuccess = () => {
    _logger("Successfully added event");
    swal("Successfully added event").then(() => {
      this.props.history.push("/admin/events");
    });
  };

  onHandleSubmitError = () => {
    _logger("Failed to added event");
    swal("Failed to add event");
  };

  setVenueId = (venue, values) => {
    this.setState(prevState => {
      return {
        ...prevState,
        event: {
          ...values,
          venueId: venue.id
        }
      };
    });
  };

  eventData = (prevState, data) => {
    if (this.props.match.params.id) {
      return {
        ...prevState,
        event: {
          ...prevState.event,
          eventTypeId: data.eventTypeId,
          name: data.name,
          summary: data.summary,
          shortDescription: data.shortDescription,
          eventStatusId: data.eventStatusId,
          imageUrl: data.imageUrl,
          externalSiteUrl: data.externalSiteUrl,
          id: data.id
        },
        isEditing: true
      };
    } else {
      return {
        ...prevState,
        event: {
          ...prevState.event,
          eventTypeId: data.eventTypeId,
          name: data.name,
          summary: data.summary,
          shortDescription: data.shortDescription,
          eventStatusId: data.eventStatusId,
          imageUrl: data.imageUrl,
          externalSiteUrl: data.externalSiteUrl
        },
        isEditing: false
      };
    }
  };

  showVenueInput = () => {
    this.setState(prevState => {
      return {
        ...prevState,
        editVenue: true
      };
    });
  };

  onClickGoBack = () => {
    this.props.history.goBack();
  };

  venueForm = () => {
    this.props.history.push("/admin/venues/create");
  };

  render() {
    _logger("Rendering EventForm component");

    return (
      <React.Fragment>
        <div className="content-wrapper">
          <div className="content-heading">
            <div>EVENT MANAGER</div>
          </div>
          <div className="row">
            <div className="col-md-8">
              <div className="card card-default">
                <div className="card-header">
                  <h3>Event Form</h3>
                </div>
                <fieldset
                  className="form-group row"
                  style={{ marginLeft: "4px", marginRight: "4px" }}
                >
                  <label className="col-md-6 col-form-label">Venue</label>

                  <div className="col-md-12">
                    {this.state.editVenue ? (
                      ""
                    ) : (
                      <button
                        onClick={this.showVenueInput}
                        className="btn btn-primary"
                      >
                        Change current venue?
                      </button>
                    )}
                    {this.state.editVenue ? (
                      <EventVenueSearch setVenueId={this.setVenueId} />
                    ) : (
                      ""
                    )}
                    <div className="col-md-6 text-right">
                      <strong
                        onClick={this.venueForm}
                        style={{ color: "green", cursor: "pointer" }}
                      >
                        Create Venue
                      </strong>
                    </div>
                  </div>
                </fieldset>
                <Formik
                  initialValues={this.state.event}
                  enableReinitialize={true}
                  validationSchema={this.state.eventSchema}
                  onSubmit={this.handleSubmit}
                  render={formikProps => (
                    <Form onSubmit={formikProps.handleSubmit}>
                      <div className="card-body">
                        <div className="form-horizontal">
                          <fieldset className="form-group row">
                            <label className="col-md-9 col-form-label">
                              Type of Event
                            </label>
                            <div className="col-md-12">
                              <Field
                                className="form-control"
                                name="eventTypeId"
                                type="select"
                                component="select"
                              >
                                <option value="">--Select Event Type--</option>
                                {this.state.eventTypes}
                              </Field>
                              {formikProps.touched.eventTypeId &&
                                formikProps.errors.eventTypeId && (
                                  <div className="text-danger">
                                    {formikProps.errors.eventTypeId}
                                  </div>
                                )}
                            </div>
                          </fieldset>

                          <fieldset className="form-group row">
                            <label className="col-md-9 col-form-label">
                              Name of the Event
                            </label>
                            <div className="col-md-12">
                              <Field
                                className="form-control"
                                placeholder="Name"
                                name="name"
                                type="text"
                              />
                              {formikProps.touched.name &&
                                formikProps.errors.name && (
                                  <div className="text-danger">
                                    {formikProps.errors.name}
                                  </div>
                                )}
                            </div>
                          </fieldset>

                          <fieldset className="form-group row">
                            <label className="col-md-9 col-form-label">
                              Summary of the Event
                            </label>
                            <div className="col-md-12">
                              <Field
                                className="form-control"
                                placeholder="Summary"
                                name="summary"
                                type="text"
                                component="textarea"
                              />
                              {formikProps.touched.summary &&
                                formikProps.errors.summary && (
                                  <div className="text-danger">
                                    {formikProps.errors.summary}
                                  </div>
                                )}
                            </div>
                          </fieldset>

                          <fieldset className="form-group row">
                            <label className="col-md-9 col-form-label">
                              Short Description
                            </label>
                            <div className="col-md-12">
                              <Field
                                className="form-control"
                                placeholder="Short Description"
                                name="shortDescription"
                                type="text"
                              />
                              {formikProps.touched.shortDescription &&
                                formikProps.errors.shortDescription && (
                                  <div className="text-danger">
                                    {formikProps.errors.shortDescription}
                                  </div>
                                )}
                            </div>
                          </fieldset>

                          <fieldset className="form-group row">
                            <label className="col-md-9 col-form-label">
                              Event Status
                            </label>
                            <div className="col-md-12">
                              <Field
                                className="form-control"
                                name="eventStatusId"
                                type="select"
                                component="select"
                              >
                                <option value="">
                                  --Select Event Status--
                                </option>
                                {this.state.eventStatus}
                              </Field>
                              {formikProps.touched.eventStatusId &&
                                formikProps.errors.eventStatusId && (
                                  <div className="text-danger">
                                    {formikProps.errors.eventStatusId}
                                  </div>
                                )}
                            </div>
                          </fieldset>
                          <fieldset className="form-group row">
                            <label className="col-md-9 col-form-label">
                              Image Url
                            </label>
                            <div className="col-md-12">
                              <Field
                                className="form-control"
                                placeholder="Short Description"
                                name="imageUrl"
                                type="text"
                              />
                              {formikProps.touched.imageUrl &&
                                formikProps.errors.imageUrl && (
                                  <div className="text-danger">
                                    {formikProps.errors.imageUrl}
                                  </div>
                                )}
                            </div>
                          </fieldset>
                          <fieldset className="form-group row">
                            <label className="col-md-9 col-form-label">
                              Event Website
                            </label>
                            <div className="col-md-12">
                              <Field
                                className="form-control"
                                placeholder="Event website"
                                name="externalSiteUrl"
                                type="text"
                              />
                              {formikProps.touched.externalSiteUrl &&
                                formikProps.errors.externalSiteUrl && (
                                  <div className="text-danger">
                                    {formikProps.errors.externalSiteUrl}
                                  </div>
                                )}
                            </div>
                          </fieldset>
                          <fieldset className="col-md-12">
                            <label className="col-form-label">
                              Is this event free?
                            </label>
                            <span className="form-check">
                              <label className="c-radio">
                                <input
                                  type="radio"
                                  name="isFree"
                                  value={1}
                                  checked={this.state.event.isFree === 1}
                                  onChange={val =>
                                    this.handleOptionChange(
                                      val,
                                      formikProps.values
                                    )
                                  }
                                  className="form-check-input"
                                />
                                <span className="fa fa-check" />
                                Yes{"\xa0\xa0\xa0\xa0\xa0\xa0\xa0"}
                              </label>

                              <label className="c-radio">
                                <input
                                  type="radio"
                                  name="isFree"
                                  value={0}
                                  checked={this.state.event.isFree === 0}
                                  onChange={val =>
                                    this.handleOptionChange(
                                      val,
                                      formikProps.values
                                    )
                                  }
                                  className="form-check-input"
                                />
                                <span className="fa fa-check" />
                                No
                              </label>
                            </span>
                          </fieldset>
                          <div className="form-group row">
                            <div className="col-md-6">
                              <label className="col-form-label">
                                Event Start Date/Time{"\xa0"}
                              </label>
                              <DatePicker
                                selected={this.state.event.dateStart}
                                onChange={val =>
                                  this.handleChangeStart(
                                    val,
                                    formikProps.values
                                  )
                                }
                                minDate={new Date()}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="MMMM d, yyyy h:mm aa"
                                timeCaption="time"
                                name="dateStart"
                                className="mb-2 form-control"
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="col-form-label">
                                Event End Date/Time{"\xa0"}
                              </label>
                              <DatePicker
                                selected={this.state.event.dateEnd}
                                onChange={val =>
                                  this.handleChangeEnd(val, formikProps.values)
                                }
                                minDate={this.state.event.dateStart}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="MMMM d, yyyy h:mm aa"
                                timeCaption="time"
                                name="dateEnd"
                                className="mb-2 form-control"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card-footer">
                        <div className="d-flex align-items-center">
                          <div className="mr-auto">
                            <em
                              style={{ cursor: "pointer" }}
                              className="fa-2x mr-2 far fa-arrow-alt-circle-left col-5"
                              onClick={this.onClickGoBack}
                            />
                          </div>
                          <div className="ml-auto">
                            <button
                              className="btn btn-primary btn-lg"
                              type="submit"
                            >
                              {this.state.isEditing ? "Update Event" : "Submit"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </Form>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
        <h1>{this.state.selectedOption}</h1>
      </React.Fragment>
    );
  }
}

EventForm.propTypes = {
  history: PropTypes.object,
  match: PropTypes.shape({
    params: PropTypes.object
  }),
  location: PropTypes.shape({
    state: PropTypes.shape({
      event: PropTypes.object
    })
  })
};

export default EventForm;
