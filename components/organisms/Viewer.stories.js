import StoryComponent from "./Viewer";

export default {
  title: "Organisms/Viewer",
  component: StoryComponent,
};

const Template = (args, { argTypes }) => ({
  components: { StoryComponent },
  props: Object.keys(argTypes),
  template: "<StoryComponent :lock=lock />",
});

export const Default = Template.bind({});
Default.args = {
  lock: {
    id: "id",
    chainId: "1",
    contentUrl: "https://vimeo.com/310675655",
    embedContent:
      '<iframe width="640" height="360" src="https://player.vimeo.com/video/310675655" frameborder="0" webkitallowfullscreen="webkitallowfullscreen" mozallowfullscreen="mozallowfullscreen" allowfullscreen="allowfullscreen"></iframe>',
    nftContractAddress: "0x84E9445f43995b0C6a4D4C1d40bb123571c2Eb06",
  },
};
