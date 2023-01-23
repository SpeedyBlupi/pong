import Container from "../components/container";
import Image from "../components/image";
import Button from "../components/button";
import Rect from "../rect";
import Pixmap from "../pixmap";
import BlupiProfil from "../components/blupi-profil";

export default class InitView extends Container {
  constructor() {
    super(...arguments);
    this.initialise();
  }

  initialise() {
    this.rect = Pixmap.fullScreen;

    this.transformations = {
      fadeIn: [{ name: "opacityIn", duration: 1 }],
      fadeInBack: [{ name: "moveToPlace", duration: 1, moveX: -800 }],
      fadeInAbout: [{ name: "moveToPlace", duration: 1, moveX: 800 }],
      fadeInTips: [{ name: "moveToPlace", duration: 1, moveX: -800 }],
      // On revient de setup.
      fadeInSetup: [{ name: "moveToPlace", duration: 1, moveY: 640 }],
      fadeOut: [
        { name: "delay", duration: 2 },
        { name: "moveFromPlace", duration: 1, moveX: -800 },
      ],
      fadeOutAbout: [{ name: "moveFromPlace", duration: 1, moveX: 800 }],
      fadeOutTips: [{ name: "moveFromPlace", duration: 1, moveX: -800 }],
      // On va dans setup.
      fadeOutSetup: [{ name: "moveFromPlace", duration: 1, moveY: 640 }],
      // On va dans choice (play).
      fadeOutChoice: [{ name: "moveFromPlace", duration: 1, moveX: -800 }],
    };

    this.children.push(Image.fromNameChannel("background", "init"));

    //------------------------------------------------------------------------

    this.children.push(
      Button.fromNameCenterSizeIconTextActionFades(
        "Init_About",
        { x: 120, y: 240 },
        { dx: 80, dy: 80 },
        31,
        "Res.ButtonAbout",
        "Phase.About",
        { out: "fadeOutAbout", in: "fadeIn" },
        InitView.buttonsTransformations
      )
    );

    this.children.push(
      Button.fromNameCenterSizeIconTextActionFades(
        "Init_Setup",
        { x: 120, y: 360 },
        { dx: 80, dy: 80 },
        13,
        "Res.ButtonSetup",
        "Phase.InitSetup",
        { out: "fadeOutSetup", in: "fadeIn" },
        InitView.buttonsTransformations
      )
    );

    //------------------------------------------------------------------------

    this.children.push(
      Button.fromNameCenterSizeIconTextActionFades(
        "Init_Tips",
        { x: 670, y: 230 },
        { dx: 60, dy: 60 },
        46,
        "Res.ButtonTips",
        "Phase.Tips",
        { out: "fadeOutTips", in: "fadeIn" },
        InitView.buttonsTransformations
      )
    );

    this.children.push(
      Button.fromNameCenterSizeIconTextActionFades(
        "Init_Play",
        { x: 670, y: 350 },
        { dx: 120, dy: 120 },
        6,
        "Res.ButtonPlay",
        "Phase.SectionChoice",
        { out: "fadeOutChoice", in: "fadeIn" },
        InitView.buttonsTransformations
      )
    );

    //------------------------------------------------------------------------

    this.children.push(
      Image.fromNameChannelRectTranformations(
        "title",
        "title",
        Rect.fromCenterSize({ x: 400, y: 120 }, { dx: 640, dy: 100 }),
        {
          fadeIn: [
            { name: "hidden", duration: 1 },
            {
              name: "zoomBounce",
              duration: 1.3,
              sound: "SoundType.HomeTreasure",
            },
          ],
          fadeInAbout: [{ name: "fix", duration: 0.1 }],
          fadeInTips: [{ name: "fix", duration: 0.1 }],
          fadeInSetup: [{ name: "fix", duration: 0.1 }],
          // On revient de section-choice (play).
          fadeInBack: [
            { name: "hidden", duration: 1 },
            {
              name: "zoomBounce",
              duration: 1.3,
              sound: "SoundType.HomeTreasure",
            },
          ],
          fadeOut: [{ name: "fix", duration: 0.1 }],
          fadeOutSetup: [{ name: "fix", duration: 0.1 }],
        }
      )
    );

    this.children.push(
      BlupiProfil.fromNameKindCenterSizeTranformations(
        "blupiProfil",
        "init",
        { x: 300, y: 350 },
        { dx: 256, dy: 256 },
        {
          // On revient de wait (jauge initiale).
          fadeIn: [{ name: "fix", duration: 0.1 }],
          fadeInAbout: [{ name: "fix", duration: 0.1 }],
          fadeInTips: [{ name: "fix", duration: 0.1 }],
          fadeInSetup: [{ name: "fix", duration: 0.1 }],
          // On revient de section-choice (play).
          fadeInBack: [
            { name: "hidden", duration: 2 },
            { name: "moveToPlace", duration: 1, moveY: 640 },
          ],
          fadeOut: [{ name: "fix", duration: 0.1 }],
          fadeOutSetup: [{ name: "fix", duration: 0.1 }],
        }
      )
    );
  }

  //------------------------------------------------------------------------

  static get buttonsTransformations() {
    return {
      // On revient de wait (jauge initiale).
      fadeIn: [
        { name: "hidden", duration: 9 }, // attente sur le "teletype" dans la bulle de blupi
        {
          name: "moveToPlace",
          duration: 0.7,
          moveY: 250,
          sound: "SoundType.Dead1",
        },
      ],
      // On revient de section-choice (play).
      fadeInBack: [
        { name: "hidden", duration: 3 },
        {
          name: "moveToPlace",
          duration: 0.7,
          moveY: 250,
          sound: "SoundType.Dead1",
        },
      ],
      fadeInAbout: [{ name: "fix", duration: 0.1 }],
      fadeInTips: [{ name: "fix", duration: 0.1 }],
      fadeInSetup: [{ name: "fix", duration: 0.1 }],
    };
  }
}
