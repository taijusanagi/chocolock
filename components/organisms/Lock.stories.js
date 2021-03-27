import StoryComponent from "./Lock";

export default {
  title: "Organisms/Lock",
  component: StoryComponent,
};

const Template = (args, { argTypes }) => ({
  components: { StoryComponent },
  props: Object.keys(argTypes),
  template: "<StoryComponent />",
});

export const Default = Template.bind({});
Default.args = {};
