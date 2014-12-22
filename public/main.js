var data = [{price: 1, energy: 1}];

var StatsBox = React.createClass({
  render: function() {
    return (
      <div className="statsBox">
        <StatsList data={this.props.data} />
      </div>
    )
  }
});

var StatsList = React.createClass({
  render: function(){
    console.log(this.props.data);
    var statNodes = this.props.data.map(function(stat){
      return (
        <Stat name={stat.name} value={stat.value}>
        </Stat>
      )
    });
    return (
      <div className="statsList">
        {statNodes}
      </div>
    )
  }
});

var Stat = React.createClass({
  render: function(){
    return (
      <div className="stat">
        <h4 className="statHeader">
          {this.props.name}
        </h4>
        <div>
          {this.props.value}
        </div>
      </div>
    )
  }
})

React.render(
  <StatsBox data={data} />,
  document.getElementById('content')
)
