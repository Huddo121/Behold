var React = require('react');

class DefaultLayout extends React.Component {
    render() {
        return (
            <html>
                <head>

                    <title>{this.props.title}</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>

                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.0/css/font-awesome.min.css"/>
                    <link href="/stylesheets/bootstrap.min.css" rel="stylesheet"/>
                    <link href="/stylesheets/mdb.min.css" rel="stylesheet"/>
                    <link href="/stylesheets/style.css" rel="stylesheet"/>
                    <link rel='stylesheet' href='/stylesheets/style.css' />
                </head>
                <body>
                    <nav className="navbar navbar-light">
                        <a className="navbar-brand" style={{fontSize: "200%", fontWeight: "Bold", fontFamily: "Arial, Helvetica, sans-serif"}} href="/"><span style={{color: '#E74D3C'}}>B</span><span style={{color: '#111'}}>ehold</span></a>
                        <ul className="nav navbar-nav pull-xs-right">
                            <li className="nav-item">
                                <a href="/containers" className="btn btn-primary nav-link">Containers</a>
                            </li>
                            <li className="nav-item">
                                <a href="/images" className="btn btn-primary nav-link">Images</a>
                            </li>
                        </ul>
                    </nav>
                    <br/>
                    <div className="container" style={{maxWidth: 'none'}}>
                        <div className="row">
                            {this.props.children}
                        </div>
                    </div>

                    <script type="text/javascript" src="/javascripts/jquery-2.2.3.min.js"></script>
                    <script type="text/javascript" src="/javascripts/tether.min.js"></script>
                    <script type="text/javascript" src="/javascripts/bootstrap.min.js"></script>
                    <script type="text/javascript" src="/javascripts/mdb.min.js"></script>
                </body>
            </html>
        );
    }
}

module.exports = DefaultLayout;
