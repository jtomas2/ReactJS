import React from "react";
import logger from "sabio-debug";
import * as venueService from "../../services/venueService";
import Autosuggest from "react-autosuggest";
import PropTypes from "prop-types";
import "./SearchStyle.css";

const _logger = logger.extend("EventVenueSearch");

const getSuggestionValue = suggestion => suggestion.name;

class EventVenueSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      suggestions: [""],
      venues: [{ name: "thing" }],
      noSuggestions: false,
      showSearchLink: false,
      inputBlank: false,
      venueId: ""
    };
  }

  renderSuggestion = suggestion => (
    <div>
      {suggestion.name}
      {suggestion.id}
    </div>
  );

  escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  getSuggestions = value => {
    const inputValue = this.escapeRegexCharacters(value.trim().toLowerCase());
    const inputLength = inputValue.length;
    const venues = this.state.venues;
    const regex = new RegExp("^" + inputValue, "i");

    return inputLength === 0
      ? []
      : venues.filter(venue => regex.test(venue.name));
  };

  onChange = (event, { newValue }) => {
    if (newValue.length === 0) {
      this.setState({
        value: newValue,
        inputBlank: true
      });
    } else if (newValue.length > 3) {
      this.setState({
        value: newValue,
        inputBlank: false
      });
      venueService.getBySearch(newValue).then(this.getBySearchSuccess);
    } else {
      this.setState({
        value: newValue,
        inputBlank: false
      });
    }
  };

  getBySearchSuccess = response => {
    if (response.item.name !== null) {
      this.setState({ venues: response.item });
    } else {
    }
  };

  onSuggestionsFetchRequested = ({ value }) => {
    const suggestions = this.getSuggestions(value);
    const isInputBlank = value.trim() === "";
    const noSuggestions = !isInputBlank && suggestions.length === 0;
    this.setState({
      suggestions,
      noSuggestions
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
      noSuggestions: false
    });
  };

  getSelected = (e, { suggestion }) => {
    _logger(e, suggestion, "-------------");
    this.props.setVenueId(suggestion);
  };
  render() {
    const { value, suggestions, noSuggestions, inputBlank } = this.state;

    const inputProps = {
      placeholder: "Find Venue",
      value,
      onChange: this.onChange
    };

    return (
      <React.Fragment>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          onSuggestionSelected={this.getSelected}
          inputProps={inputProps}
        />
        {inputBlank && (
          <div className="venue-required text-danger">Venue is Required</div>
        )}
        {this.state.value.length > 0 && this.state.value.length <= 3 && (
          <div>Input minumum 3 characters to search</div>
        )}
        {this.state.value.length > 3 && noSuggestions && (
          <div className="no-suggestions">No suggestions</div>
        )}
      </React.Fragment>
    );
  }
}

EventVenueSearch.propTypes = {
  setVenueId: PropTypes.func.isRequired
};

export default EventVenueSearch;
