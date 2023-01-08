import React from 'react';
import axios from 'axios';

class ImageForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {image: null, value: ''};
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
        if (event.target.files && event.target.files[0]) {
            this.setState({image: URL.createObjectURL(event.target.files[0])});
          }
      this.setState({value: event.target.value});
    }
  
    handleSubmit(event) {
      alert('A file was submitted: ' + this.state.value);
      this.setState({image: null});
      event.preventDefault();
      
      axios.post('http://localhost:5000/upload', {
        image: this.state.value
        `${process.env}`.REACT_APP_API_URL
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      }
      );

    }
  
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
            <label for="equation">Select picture:&nbsp;</label>
            <input type="file"
            accept="image/png, image/jpeg, image/jpg"
            value={this.state.value}
            onChange={this.handleChange}
            name="equation" />
          <input type="submit" value="Upload File" />
          <img id="target" src={this.state.image} width="300px"/>
        </form>
      );
    }
  }

export default ImageForm;