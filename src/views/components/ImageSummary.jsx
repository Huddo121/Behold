var React = require('react');

class ImageSummary extends React.Component {
    render() {

        let spawnedContainers = this.props.summary.containers.map((container) => {
            return (
                <div key={container.id} className="stack">
                    Container: <a href={"/containers/" + container.id}>{container.name}</a>
                </div>
            )
        });

        return (
            <div style={{width: 'fit-content'}}>
                <article className="card">
                    <header className="flex">
                        <strong><span><a href={"/images/" + this.props.summary.id}>{this.props.summary.name}</a></span></strong>
                    </header>
                    <footer>
                        {spawnedContainers}
                    </footer>
                </article>
            </div>
        );
    }
}

module.exports = ImageSummary;
