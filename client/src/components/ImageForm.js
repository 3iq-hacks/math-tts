import React from 'react';
import axios from 'axios';
import FormData from 'form-data';
// import styled from "styled-components";

class ImageForm extends React.Component {
    constructor(props) {
      super(props);

      this.state = {image: null, imageURL: '', value: '', submitted: false};

  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            console.log('Got file:', file);
            this.setState({imageUrl: URL.createObjectURL(file), image: file});
        } else {
            console.log('No file selected')
            this.setState({imageUrl: '', image: null});
        }
        this.setState({value: event.target.value});
    }
  
    handleSubmit(event) {
      event.preventDefault();
      
      // https://masteringjs.io/tutorials/axios/axios-multi-form-data
      // uploading a form requires formData
      const img = this.state.image;
      const formData = new FormData();
      formData.append('file', img);
      console.log(formData);
      axios.post('http://localhost:8000/upload-img', formData, {
        headers: {'Content-Type': 'multipart/form-data' }
      })
        .then(function (response) {
            // get data
            console.log(`Latex is: ${JSON.stringify(response.data)}`);
        })
        .catch(function (error) {
            console.log(error);
        })
       .finally(() => { 

            this.setState({image: null, value: '', imageURL: '', submitted: true});

      });
    }

    handleClick(event) {

    }
  
    render() {
      return (
        <div>
        <form onSubmit={this.handleSubmit}>
          <label for="equation">Select picture:&nbsp;</label>
          <input type="file"
            accept="image/png, image/jpeg, image/jpg"
            value={this.state.value}
            onChange={this.handleChange}
            name="equation" />
          <input type="submit" value="Upload File" />
          <img id="target" alt='' src={this.state.imageUrl} width="300px"/>
        </form>
        {this.state.submitted && (
            <ViewResults
                audioInfo={state.audioInfo}
                boomedBlobURL={state.boomedBlobURL}
            />
        )}
      </div>
      );
    }
  }

export default ImageForm;