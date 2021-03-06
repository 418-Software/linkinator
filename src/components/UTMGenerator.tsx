import * as React from "react";
import { Divider, IconButton } from "@mui/material";
import Grid from '@mui/material/Grid';
import { LinkSaveButton } from "./LinkSaveButton";
import { LinkSelector } from "./LinkSelector";
import { TextFieldWithDescription } from "./TextFieldWithDescription";
import TextField from '@mui/material/TextField';
import { PersistentListCache } from "../lib/persistentCache"
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface Props {
}

interface State{
    campaignCache: [string]
    contentCache: [string]
    currentURL: string
    linkCache: [string]
    mediumCache: [string]
    sourceCache: [string]
    termCache: [string]
    trackingURL: string
}

export class UTMGenerator extends React.Component<Props, State> {
    caches: Map<string, PersistentListCache>;
    sourceURL: string;
    textInputs: { campaign: string; content: string; link: string; medium: string; source: string; term: string; };

    constructor(props: Props) {
        super(props);
        this.textInputs = {
            campaign: '',
            content: '',
            link: '',
            medium: '',
            source: '',
            term: ''
        }

        this.sourceURL = '';
        this.caches = new Map([["linkCache", new PersistentListCache("linkCache")]]);
        for (var key of Object.keys(this.textInputs)){
            var name = key + "Cache"
            this.caches.set(name, new PersistentListCache(name))
        }
        
        // State seems to require a pretty flat structure, so this is going
        // to force some copy/paste code
        this.state = {
            currentURL: '',
            campaignCache: this.caches.get("campaignCache")!.get(),
            contentCache: this.caches.get("contentCache")!.get(),
            linkCache: this.caches.get("linkCache")!.get(),
            mediumCache: this.caches.get("mediumCache")!.get(),
            sourceCache: this.caches.get("sourceCache")!.get(),
            termCache: this.caches.get("termCache")!.get(),
            trackingURL: '',
        };
    
        this.currentUrlListener = this.currentUrlListener.bind(this);
        this.handleChangedInput = this.handleChangedInput.bind(this);
        this.addItemToCache = this.addItemToCache.bind(this);
        this.updateStateFromCache = this.updateStateFromCache.bind(this);
        this.updateCacheEntry = this.updateCacheEntry.bind(this);
        this.updateTrackingURL = this.updateTrackingURL.bind(this);
        this.copyToClipboard = this.copyToClipboard.bind(this);
    }

    addItemToCache(cacheName: string, link: string) {
        var obj = this.caches.get(cacheName)!;
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

    async copyToClipboard(text){
        console.log("Saving to clipboard: " + text)
        await navigator.clipboard.writeText(text);
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

    updateCacheEntry(cacheName: string, value: string){
        this.handleChangedInput(value, cacheName.replace("Cache", ""));
        var obj = this.caches.get(cacheName)!;
        obj.add(value);
        this.updateStateFromCache(cacheName);
        this.updateTrackingURL();
    }

    updateStateFromCache(cacheName: string){
        var obj = this.caches.get(cacheName)!;
        obj.refresh();
        var stateObject = {};
        stateObject[cacheName] = obj.get();
        this.setState(stateObject);
    }

    updateTrackingURL(){
        let urlArray = [this.textInputs.link]
        for (let [key, value] of Object.entries(this.textInputs)){
            if(value !== '' && key !== "link"){
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
                <LinkSelector linkCache={this.state.linkCache} cacheName="linkCache" onBlur={this.updateCacheEntry} onOpen={this.updateStateFromCache}/>
            </Grid>
            <Grid item>
                <TextFieldWithDescription name="source" options={this.state.sourceCache} value={this.textInputs.source} onBlur={this.updateCacheEntry} onOpen={this.updateStateFromCache} description="Where the link is being posted.  Usually something like Medium, Facebook, Twitter, LinkedIn, etc."/>
                <TextFieldWithDescription name="medium" options={this.state.mediumCache} value={this.textInputs.medium} onBlur={this.updateCacheEntry} onOpen={this.updateStateFromCache} description="How the link is being delivered.  Usually email, banner, social media, etc."/>
                <TextFieldWithDescription name="term" options={this.state.termCache} value={this.textInputs.term} onBlur={this.updateCacheEntry} onOpen={this.updateStateFromCache} description="Paid keywords or other identifying terms."/>
                <TextFieldWithDescription name="content" options={this.state.contentCache} value={this.textInputs.content} onBlur={this.updateCacheEntry} onOpen={this.updateStateFromCache} description="Any string to help you differentiate this link in your analytics platform."/>
                <TextFieldWithDescription name="campaign" options={this.state.campaignCache} value={this.textInputs.campaign} onBlur={this.updateCacheEntry} onOpen={this.updateStateFromCache} description="The name of the ad campaign this link is a part of."/>
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
                    InputProps={{
                        readOnly: true, 
                        endAdornment: <IconButton
                            onClick={() => {this.copyToClipboard(this.state.trackingURL)}}
                            edge="end"
                        >
                        <ContentCopyIcon/>
                        </IconButton>
                    }}
                    variant="standard"
                    />
                </Grid>
                </Grid>
            </Grid>
            </Grid>
        );
    }
}