const { Component } = React
const { render } = ReactDOM
// const { Switch, Link, Route, HashRouter, Redirect } = ReactRouterDOM
const companiesURL = "https://acme-users-api-rev.herokuapp.com/api/companies"
const randomUserURL = " https://acme-users-api-rev.herokuapp.com/api/users/random"
const APIURL = "https://acme-users-api-rev.herokuapp.com/api/"
// const root = document.querySelector('#root')
const root = document.querySelector('#root');

const randomUserPromise = axios.get(randomUserURL)
const companiesPromise = axios.get(companiesURL)



class App extends Component {
    state = {
        user: [],
        followingCompanies: [],
        allCompanies: []
    };
    componentDidMount() {
        // console.log('component did mouint')
        randomUserPromise
            .then(res => {
                console.log(res)
                this.setState(
                    {
                        user: res.data,
                    }
                )
                return res.data
            })
            .then(res => {
                console.log(res)
                const followingPromise = axios.get(APIURL + `users/${res.id}/followingCompanies`)
                return followingPromise
            })
            .then(res => {
                console.log(res)
                this.setState(
                    {
                        followingCompanies: res.data
                    }
                )
            })
        companiesPromise
            .then(res => {
                this.setState(
                    {
                        allCompanies: res.data
                    }
                )
            })
    }
    render() {
        console.log(this.state);
        return (
            <div>
                <h1>Acme Company Follower</h1>
                <h2>You ( {this.state.user.fullName}) are following {this.state.followingCompanies.length} Companies</h2>
                <FollowedCompanies followingCompanies={this.state.followingCompanies} allCompanies={this.state.allCompanies} user ={this.state.user} />
            </div>
        )
    }
}



class FollowedCompanies extends Component {
    state = {
        followingCompanies:[]
    }
    componentDidMount() {
        this.setState(
            {followingCompanies: this.props.followingCompanies}
        )
    }
    render() {
        const { followingCompanies, allCompanies } = this.props
        // // console.log(followingCompanies)
        // followingCompanies.forEach(currV => {
        //     for (let i = 0; i < allCompanies.length; i++) {
        //         if (allCompanies[i].id == currV.id) {
        //             followingCompanies[i][name] = allCompanies[i].name
        //         }
        //     }
        // })
        return (
            allCompanies.map(currV => {
                return (
                    <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100vw',
                        alignItems: 'left',
                        fontFamily: 'Roboto',
                      }}>
                        <li key={currV.id}>{currV.name}</li>
                        <select name="ratings" id={currV.id}
                            onChange={(e) => {
                                fetch(`${APIURL}users/${this.props.user.id}/followingCompanies`, {
                                    headers: {
                                      'Content-Type': 'application/json',
                                    },
                                    method: 'PUT',
                                    body: JSON.stringify(e.target.value)
                                  });
                                  }}>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                        </select>
                    </div>
                )
            })
        )
    }
}

render(<App />, root)
