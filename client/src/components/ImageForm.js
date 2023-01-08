import React from 'react';
import axios from 'axios';
import FormData from 'form-data';
import ReactAudioPlayer from "react-audio-player";
import Card from 'react-bootstrap/Card';
import env from 'react-dotenv';

const ViewResults = () => {

  return (
    <div style={{justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column'}}>
      <p1>Let's listen to some math!</p1>
      <ReactAudioPlayer src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" controls/>
    </div>
  )
};

class ImageForm extends React.Component {
    constructor(props) {
      super(props);

      this.state = {image: null, imageURL: '', value: '', submitted: false};

  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
      event.preventDefault();
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            console.log('Got file:', file);
            this.setState({imageURL: URL.createObjectURL(file), image: file});
        } else {
            console.log('No file selected')
            this.setState({imageURL: '', image: null});
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
      axios.post(`${env.REACT_APP_API_URL}/upload-img`, formData, {
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
        <Card
            style={{
                display: "flex",
                flexDirection:'column',
                alignItems: "center",
                backgroundColor: "#000000",
                borderWidth: "10px",
                borderColor: "black",
                borderRadius: "10px",
                padding: "20px"
            }}
        >
        <div>
        <form onSubmit={this.handleSubmit}>
          <label for="equation">Upload:&nbsp;</label>
          <input type="file"
            accept="image/png, image/jpeg, image/jpg, .tex"
            value={this.state.value}
            onChange={this.handleChange}
            name="equation" />
          <input type="submit" value="Upload File" />
        </form>
        </div>
        <div>
          <img id="target" alt='' src={this.state.imageURL} width="300px"/>
        </div>
        <div>
          {this.state.submitted && (
              <ViewResults/>
          )}
      </div>
      </Card>
    </div>
      );
    }
  }

export default ImageForm;