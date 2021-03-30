import StoryComponent from "./Create";

export default {
  title: "Organisms/Create",
  component: StoryComponent,
};

const Template = (args, { argTypes }) => ({
  components: { StoryComponent },
  props: Object.keys(argTypes),
  template: "<StoryComponent />",
});

export const Default = Template.bind({});
Default.args = {};
