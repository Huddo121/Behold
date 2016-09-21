var React = require('react');

class DefaultLayout extends React.Component {
    render() {
        return (
            <html>
                <head>
                    <title>{this.props.title}</title>
                    <link rel='stylesheet' href='/stylesheets/style.css' />
                    <link rel='stylesheet' href='/stylesheets/picnic.min.css'/>
                </head>
                <body>
                    <nav style={{position: "absolute"}}>
                        <span className="brand" style={{fontSize: "160%"}}>
                            <span style={{color: '#E74D3C'}}>B</span><span>ehold</span>
                        </span>
                    </nav>
                    {this.props.children}
                </body>
            </html>
        );
    }
}

module.exports = DefaultLayout;
