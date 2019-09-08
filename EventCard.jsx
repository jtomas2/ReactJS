import React from "react";
import PropTypes from "prop-types";
import "./EventStyle.css";
import * as dateService from "../../services/dateService";

const EventCard = props => {
  const viewItemClick = () => {
    props.onViewBtnHandler(props.event);
  };
  const editItemClick = () => {
    props.onEditBtnHandler(props.event);
  };
  const deleteItemClick = () => {
    props.onDeleteBtnHandler(props.event.id);
  };

  const shortSummary = props.event.summary.substring(
    0,
    Math.min(50, props.event.summary.length)
  );

  return (
    <React.Fragment>
      <div className="col-sm-6 col-md-4 col-lg-3" key={props.event.id}>
        <div className="card">
          <img
            className="card-img-top"
            alt="eventPic"
            src={
              props.event.imageUrl
                ? props.event.imageUrl
                : "https://image.freepik.com/free-vector/retro-bicycle_23-2147514491.jpg"
            }
          />
          <div className="border-bottom">
            <button className="btn-oval btn btn-info btn-xs">
              {props.event.eventType.name}
            </button>
            <span className="float-right">{props.event.eventVenues.name}</span>
          </div>
          <div className="card-body">
            <h4 className="card-title">{props.event.name}</h4>
            <span className="card-text">{shortSummary}</span>
          </div>
          <div className="card-footer">
            <a
              className="text-info"
              style={{ color: "green", cursor: "pointer" }}
              onClick={viewItemClick}
            >
              Read More{"\xa0"}
            </a>
            <em
              style={{ cursor: "pointer" }}
              className="fa-1x mr-2 fas fa-edit"
              onClick={editItemClick}
              name="edit"
              data-toggle="tooltip"
              data-placement="top"
              title="Edit Event"
            />
            <em
              style={{ cursor: "pointer" }}
              className="fa-1x mr-2 fas fa-trash-alt"
              onClick={deleteItemClick}
              name="delete"
              data-toggle="tooltip"
              data-placement="right"
              title="Delete Event"
            />
            <div className="card-text float-right">
              {dateService.formatDate(props.event.dateStart)}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

EventCard.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    externalSiteUrl: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    eventVenues: PropTypes.shape({
      name: PropTypes.string.isRequired
    }),
    eventType: PropTypes.shape({
      name: PropTypes.string.isRequired
    }),
    summary: PropTypes.string.isRequired,
    dateStart: PropTypes.string.isRequired
  }),
  onDeleteBtnHandler: PropTypes.func.isRequired,
  onEditBtnHandler: PropTypes.func.isRequired,
  onViewBtnHandler: PropTypes.func.isRequired
};

export default EventCard;
