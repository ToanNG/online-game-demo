ig.module(
  'game.entities.player'
)
.requires(
  'impact.entity'
)
.defines(function(){

////////////////////////////////Entity Player////////////////////////////////
EntityPlayer = ig.Entity.extend({
  size: {x: 32, y: 32},
  type: ig.Entity.TYPE.A,
  checkAgainst: ig.Entity.TYPE.NONE,
  collides: ig.Entity.COLLIDES.PASSIVE,

  name: window.inputName,
  health: 3000,
  speed: 100,
  targetX: 0,
  targetY: 0,
  direction: null,
  currentAnimation: 6,
  netTimer: 10,

  animSheet: new ig.AnimationSheet( 'media/player.png', 32, 32 ),

  init: function( x, y, settings ) {
    this.parent( x, y, settings );

    this.addAnim( 'up', 0.16, [4,5] );
    this.addAnim( 'down', 0.16, [0,1] );
    this.addAnim( 'left', 0.16, [2,3] );
    this.addAnim( 'right', 0.16, [6,7] );
    this.addAnim( 'idleup', 0.1, [4] );
    this.addAnim( 'idledown', 0.1, [0] );
    this.addAnim( 'idleleft', 0.1, [2] );
    this.addAnim( 'idleright', 0.1, [6] );

    this.maxVel.x = this.maxVel.y = this.speed;
    this.currentAnim = this.anims.idledown;

    this.correctPosition();

    socket.emit('initialize player', this.name);
  },

  /**
   * This makes sure the player is always correctly centered in a tile.
   */
  correctPosition: function() {
    xMod = this.pos.x.round() % 32;
    yMod = this.pos.y.round() % 32;
    this.pos.x = this.pos.x.round() - xMod;
    this.pos.y = this.pos.y.round() - yMod;
  },

  update: function() {
    if( this.vel.x == 0 && this.vel.y == 0 ) {
      if( ig.input.state('up') ) {
        this.vel.y = -this.speed;
        this.vel.x = 0;
        this.currentAnim = this.anims.up;
        this.targetY = this.pos.y.round() - 32;
        this.direction = 'up';
        this.currentAnimation = 1;
      }
      else if( ig.input.state('down') ) {
        this.vel.y = +this.speed;
        this.vel.x = 0;
        this.currentAnim = this.anims.down;
        this.targetY = this.pos.y.round() + 32;
        this.direction = 'down';
        this.currentAnimation = 2;
      }
      else if( ig.input.state('left') ) {
        this.vel.x = -this.speed;
        this.vel.y = 0;
        this.currentAnim = this.anims.left;
        this.targetX = this.pos.x.round() - 32;
        this.direction = 'left';
        this.currentAnimation = 3;
      }
      else if( ig.input.state('right') ) {
        this.vel.x = +this.speed;
        this.vel.y = 0;
        this.currentAnim = this.anims.right;
        this.targetX = this.pos.x.round() + 32;
        this.direction = 'right';
        this.currentAnimation = 4;
      }
    }
    else {
      if( this.direction == 'up' && this.pos.y.round() <= this.targetY ) {
        this.vel.y = 0;
        this.currentAnim = this.anims.idleup;
        this.currentAnimation = 5;
      }
      else if( this.direction == 'down' && this.pos.y.round() >= this.targetY ) {
        this.vel.y = 0;
        this.currentAnim = this.anims.idledown;
        this.currentAnimation = 6;
      }
      else if( this.direction == 'left' && this.pos.x.round() <= this.targetX ) {
        this.vel.x = 0;
        this.currentAnim = this.anims.idleleft;
        this.currentAnimation = 7;
      }
      else if( this.direction == 'right' && this.pos.x.round() >= this.targetX ) {
        this.vel.x = 0;
        this.currentAnim = this.anims.idleright;
        this.currentAnimation = 8;
      }

      this.pos.x = this.pos.x.round();
      this.pos.y = this.pos.y.round();
    }

    if( this.netTimer < 1 ) {
      this.netTimer = 5;
      socket.emit( 'update player', this.pos.x, this.pos.y, this.currentAnimation, this.name );
    }
    this.netTimer = this.netTimer - 1;

    this.parent();
  },

  handleMovementTrace: function( res ) {
    if( res.collision.x || res.collision.y ) {
      this.vel.x = 0;
      this.vel.y = 0;

      if( this.direction == 'up' ) {
        this.currentAnim = this.anims.idleup;
      }
      else if( this.direction == 'down' ) {
        this.currentAnim = this.anims.idledown;
      }
      else if( this.direction == 'left' ) {
        this.currentAnim = this.anims.idleleft;
      }
      else if( this.direction == 'right' ) {
        this.currentAnim = this.anims.idleright;
      }

      this.correctPosition();
    }
    this.parent( res );
  }
});

////////////////////////////////Entity Other Player////////////////////////////////
EntityOtherPlayer = ig.Entity.extend({
  size: {x: 32, y: 32},
  type: ig.Entity.TYPE.B,
  checkAgainst: ig.Entity.TYPE.NONE,
  collides: ig.Entity.COLLIDES.PASSIVE,

  name: '',
  health: 3000,
  speed: 100,
  animation: 1,

  animSheet: new ig.AnimationSheet( 'media/player.png', 32, 32 ),
  font: new ig.Font( 'media/04b03.font.png' ),

  init: function( x, y, settings ) {
    this.parent( x, y, settings );

    this.addAnim( 'up', .21, [4,5] );
    this.addAnim( 'down', .21, [0,1] );
    this.addAnim( 'left', .21, [2,3] );
    this.addAnim( 'right', .21, [6,7] );
    this.addAnim( 'idleup', 0.1, [4] );
    this.addAnim( 'idledown', 0.1, [0] );
    this.addAnim( 'idleleft', 0.1, [2] );
    this.addAnim( 'idleright', 0.1, [6] );
  },

  netmoveplayer: function() {

  },

  update: function() {
    switch( this.animation ) {
      case 1:
        this.currentAnim = this.anims.up;
        break;
      case 2:
        this.currentAnim = this.anims.down;
        break;
      case 3:
        this.currentAnim = this.anims.left;
        break;
      case 4:
        this.currentAnim = this.anims.right;
        break;
      case 5:
        this.currentAnim = this.anims.idleup;
        break;
      case 6:
        this.currentAnim = this.anims.idledown;
        break;
      case 7:
        this.currentAnim = this.anims.idleleft;
        break;
      case 8:
        this.currentAnim = this.anims.idleright;
        break;
    }
  },

  draw: function() {
    this.parent();

    var x = this.pos.x - window.gameScreen.x + 16,
      y = this.pos.y - window.gameScreen.y - 16;
    this.font.draw( this.name, x, y, ig.Font.ALIGN.CENTER );
  }
});

});
