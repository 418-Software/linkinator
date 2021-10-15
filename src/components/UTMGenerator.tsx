import * as React from "react";
import { Divider } from "@mui/material";
import Grid from '@mui/material/Grid';
import { LinkSaveButton } from "./LinkSaveButton";
import { LinkSelector } from "./LinkSelector";
import { TextFieldWithDescription } from "./TextFieldWithDescription";
import TextField from '@mui/material/TextField';
import { PersistentListCache } from "../lib/persistentCache"

interface Props {
}

interface State{
    campaignCache: [string]
    contentCache: [string]
    currentURL: string
    linkCache: [string]
    mediumCache: [string]
    sourceCache: [string]
    sourceURL: string
    termCache: [string]
    trackingURL: string
}

export class UTMGenerator extends React.Component<Props, State> {
    caches: [PersistentListCache];
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

        this.caches = [new PersistentListCache("linkCache")];
        for (var key of Object.keys(this.textInputs)){
            this.caches.push(new PersistentListCache(key + "Cache"))
        }
        
        // State seems to require a pretty flat structure, so this is going
        // to force some copy/paste code
        this.state = {
            currentURL: '',
            campaignCache: this.caches["campaignCache"].get(),
            contentCache: this.caches["contentCache"].get(),
            linkCache: this.caches["linkCache"].get(),
            mediumCache: this.caches["mediumCache"].get(),
            sourceCache: this.caches["sourceCache"].get(),
            termCache: this.caches["termCache"].get(),
            sourceURL: '',
            trackingURL: '',
        };
    
        this.currentUrlListener = this.currentUrlListener.bind(this);
        this.handleChangedInput = this.handleChangedInput.bind(this);
        this.addItemToCache = this.addItemToCache.bind(this);
    }

    addItemToCache(cacheName: string, link: string) {
        var obj = this.caches[cacheName];
        obj.add(link);
        this.updateStateFromCache(cacheName);
    }

    componentDidMount() {
        // Populate initial URLs
        this.currentUrlListener()
        this.updateTrackingURL()
    }
  
    componentWillUnmount() {
    }

    currentUrlListener() {
        try{
            chrome.tabs.query({'active': true, currentWindow: true}, tabs => {
            this.setState({currentURL: tabs[0].url + ''});
            });
        } catch (error) {
            this.setState({currentURL: ''});
        }
    }

    handleChangedInput(userText: string, name: string){
        this.textInputs = {...this.textInputs, [name]: userText}
        this.updateTrackingURL()
    }

    updateStateFromCache(cacheName: string){
        var obj = this.caches[cacheName];
        console.log(obj);
        obj.refresh();
        var stateObject = {};
        stateObject[cacheName] = obj.get();
        this.setState(stateObject);
    }

    updateTrackingURL(){
        let urlArray = [this.state.sourceURL]
        for (let [key, value] of Object.entries(this.textInputs)){
            if(value !== ''){
                (urlArray.length === 1)
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
                <LinkSaveButton currentURL={this.state.currentURL} cacheName="linkCache" onClick={this.addItemToCache}/>
                <Divider variant="middle" />
                <LinkSelector linkCache={this.state.linkCache} cacheName="linkCache" onOpen={this.updateStateFromCache} value={this.state.sourceURL}/>
            </Grid>
            <Grid item>
                <TextFieldWithDescription name="source" options={this.state.sourceCache} value={this.textInputs.source} onOpen={this.updateStateFromCache} onChange={this.handleChangedInput} description="Where the link is being posted.  Usually something like Medium, Facebook, Twitter, LinkedIn, etc."/>
                <TextFieldWithDescription name="medium" options={this.state.mediumCache} value={this.textInputs.medium} onOpen={this.updateStateFromCache} onChange={this.handleChangedInput} description="How the link is being delivered.  Usually email, banner, social media, etc."/>
                <TextFieldWithDescription name="term" options={this.state.termCache} value={this.textInputs.term} onOpen={this.updateStateFromCache} onChange={this.handleChangedInput} description="Paid keywords or other identifying terms."/>
                <TextFieldWithDescription name="content" options={this.state.contentCache} value={this.textInputs.content} onOpen={this.updateStateFromCache} onChange={this.handleChangedInput} description="Any string to help you differentiate this link in your analytics platform."/>
                <TextFieldWithDescription name="campaign" options={this.state.campaignCache} value={this.textInputs.campaign} onOpen={this.updateStateFromCache} onChange={this.handleChangedInput} description="The name of the ad campaign this link is a part of."/>
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