ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	'game.entities.player',
	'game.levels.level1'
	// 'impact.debug.debug'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	font: new ig.Font( 'media/04b03.font.png' ),
	
	init: function() {
		ig.input.bind( ig.KEY.A, 'left' );
		ig.input.bind( ig.KEY.D, 'right' );
		ig.input.bind( ig.KEY.W, 'up' );
		ig.input.bind( ig.KEY.S, 'down' );

		this.loadLevel(LevelLevel1);
	},
	
	update: function() {
		this.parent();

		var player = this.getEntitiesByType( EntityPlayer )[0];
		if( player ) {
			gameScreen.x = this.screen.x = player.pos.x - ig.system.width/2;
			gameScreen.y = this.screen.y = player.pos.y - ig.system.height/2;
		}
	},
	
	draw: function() {
		this.parent();

		var player = this.getEntitiesByType( EntityPlayer )[0];
		this.font.draw( 'Name: ' + player.name + ' Health: ' + player.health, 0, 0 );
	}
});

ig.main( '#canvas' , MyGame, 60, 640, 480, 1);

});
