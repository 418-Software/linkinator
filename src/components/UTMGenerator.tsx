import * as React from "react";
import Grid from '@mui/material/Grid';
import { TextFieldWithDescription } from "./TextFieldWithDescription";
import TextField from '@mui/material/TextField';

interface Props {
}

interface State{
    currentURL: string
    trackingURL: string
}

export class UTMGenerator extends React.Component<Props, State> {
    textInputs: { campaign: string; content: string; medium: string; source: string; term: string; };

    constructor(props: Props) {
        super(props);
        this.textInputs = {
            campaign: '',
            content: '',
            medium: '',
            source: '',
            term: ''
        }
        
        this.state = {
            currentURL: '',
            trackingURL: '',
        };
    
        chrome.tabs.onActivated.addListener(this.currentUrlListener);
        this.currentUrlListener = this.currentUrlListener.bind(this);
        this.handleChangedInput = this.handleChangedInput.bind(this);
    }

    componentDidMount() {
        // Populate initial URLs
        this.currentUrlListener(Object())
        this.updateTrackingURL()
    }
  
    componentWillUnmount() {
    }

    currentUrlListener(activeInfo: object) {
        chrome.tabs.query({'active': true, currentWindow: true}, tabs => {
          this.setState({currentURL: tabs[0].url + ''});
        });
    }

    handleChangedInput(userText: string, name: string){
        this.textInputs = {...this.textInputs, [name]: userText}
        this.updateTrackingURL()
    }

    updateTrackingURL(){
        let urlArray = [this.state.currentURL]
        for (let [key, value] of Object.entries(this.textInputs)){
            if(value !== ''){
                (urlArray.length == 1)
                    ? urlArray.push("?")
                    : urlArray.push("&")
                urlArray.push("utm_" + key + "=" + encodeURIComponent(value))
            }
        }
        this.setState({trackingURL: urlArray.join('')})
    }

    render(){
        return (
        <Grid container spacing={2}>
            <Grid item>
                <Grid container spacing={2} padding={1}>
                    <Grid item width={600}>
                        <TextField fullWidth
                        id="current-url"
                        label="Current URL"
                        value={this.state.currentURL}
                        size="small"
                        InputLabelProps={{shrink: true}}
                        InputProps={{readOnly: true}}
                        variant="standard"
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <TextFieldWithDescription name="source" value={this.textInputs.source} onChange={this.handleChangedInput} description="Where the link is being posted.  Usually something like Medium, Facebook, Twitter, LinkedIn, etc."/>
                <TextFieldWithDescription name="medium" value={this.textInputs.medium} onChange={this.handleChangedInput} description="How the link is being delivered.  Usually email, banner, social media, etc."/>
                <TextFieldWithDescription name="term" value={this.textInputs.term} onChange={this.handleChangedInput} description="Paid keywords or other identifying terms."/>
                <TextFieldWithDescription name="content" value={this.textInputs.content} onChange={this.handleChangedInput} description="Any string to help you differentiate this link in your analytics platform."/>
                <TextFieldWithDescription name="campaign" value={this.textInputs.campaign} onChange={this.handleChangedInput} description="The name of the ad campaign this link is a part of."/>
            </Grid>
            <Grid item>
                <Grid container spacing={2} padding={1}>
                <Grid item width={600}>
                    <TextField fullWidth
                    id="tracked-url"
                    label="Tracked URL"
                    value={this.state.trackingURL}
                    size="small"
                    InputLabelProps={{shrink: true}}
                    InputProps={{readOnly: true}}
                    variant="standard"
                    />
                </Grid>
                </Grid>
            </Grid>
            </Grid>
        );
    }
}