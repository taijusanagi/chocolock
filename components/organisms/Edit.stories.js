import StoryComponent from "./Edit";

export default {
  title: "Organisms/Edit",
  component: StoryComponent,
};

const Template = (args, { argTypes }) => ({
  components: { StoryComponent },
  props: Object.keys(argTypes),
  template: "<StoryComponent />",
});

export const Default = Template.bind({});
Default.args = {};
