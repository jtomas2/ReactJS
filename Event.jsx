import React from "react";
import logger from "sabio-debug";
import * as eventService from "../../services/eventService";
import EventCard from "./EventCard";
import "./EventStyle.css";
import swal from "sweetalert";
import PropTypes from "prop-types";
import Paginate from "../userProfiles/Paginate";

const _logger = logger.extend("Events");

class Events extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      mappedEvents: [],
      pageIndex: 0,
      pageSize: 12,
      totalCount: 0,
      currentPage: 0,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false
    };
  }

  componentDidMount() {
    this.getEvents();
  }

  getEvents = () => {
    eventService
      .get(this.state.pageIndex, this.state.pageSize)
      .then(this.onGetSuccess)
      .catch(this.onGetError);
  };

  onGetSuccess = response => {
    const events = response.item;
    _logger(events);

    this.setState(prevState => {
      return {
        ...prevState,
        events: events.pagedItems,
        mappedEvents: events.pagedItems.map(this.mapEvent),
        pageIndex: events.pageIndex,
        pageSize: events.pageSize,
        totalCount: events.totalCount,
        hasPreviousPage: events.hasPreviousPage,
        hasNextPage: events.hasNextPage,
        totalPages: events.totalPages
      };
    });
  };

  onDeleteBtnHandler = id => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this event!",
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
        _logger(id);
        eventService
          .deleteById(id)
          .then(this.onDeleteSuccess)
          .catch(this.onDeleteError);
        swal("Your event has been deleted.");
      } else {
        swal("This event is safe!");
      }
    });
  };

  onDeleteSuccess = () => {
    this.getEvents();
  };

  onDeleteError = () => {
    _logger("Delete error");
  };

  onEditBtnHandler = event => {
    _logger(event);
    this.props.history.push(`/admin/event/${event.id}/edit`, { event });
  };

  onViewBtnHandler = event => {
    _logger("View button clicked", event);
    this.props.history.push(`/admin/event/${event.id}`, { event });
  };

  mapEvent = event => (
    <EventCard
      key={event.id}
      event={event}
      onEditBtnHandler={this.onEditBtnHandler}
      onDeleteBtnHandler={this.onDeleteBtnHandler}
      onViewBtnHandler={this.onViewBtnHandler}
    />
  );

  goToPage = e => {
    let currentPage = Number(e.target.id);
    _logger("set currentPage", e.target);
    _logger("set currentPage", e.target.id);
    this.setState(
      prevState => {
        return {
          ...prevState,
          currentPage
        };
      },
      () => this.getEvents()
    );
  };

  directToForm = () => {
    this.props.history.push("/admin/event/new");
  };

  render() {
    _logger("Rendering Events component");
    return (
      <React.Fragment>
        <div className="content-wrapper">
          <div className="content-heading">
            <div className="col-md-6">Events List</div>
            <div className="offset-5">
              <button
                type="button"
                className="btn btn-success float-right"
                onClick={this.directToForm}
              >
                Create Event
              </button>
            </div>
          </div>
          <div className="row">{this.state.mappedEvents}</div>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Paginate
            goToPage={this.goToPage}
            totalPages={this.state.totalPages}
            currentPage={this.state.currentPage}
            hasPreviousPage={this.state.hasPreviousPage}
            hasNextPage={this.state.hasNextPage}
          />
        </div>
      </React.Fragment>
    );
  }
}

Events.propTypes = {
  history: PropTypes.object.isRequired
};

export default Events;
