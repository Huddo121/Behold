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
                            <a href="/"><span style={{color: '#E74D3C'}}>B</span><span style={{color: '#111'}}>ehold</span></a>
                        </span>
                        <div style={{float: "right"}}>
                            <a href="/containers" className="pseudo button icon-picture">Containers</a>
                            <a href="/images" className="pseudo button icon-puzzle">Images</a>
                        </div>
                    </nav>
                    {this.props.children}
                </body>
            </html>
        );
    }
}

module.exports = DefaultLayout;
