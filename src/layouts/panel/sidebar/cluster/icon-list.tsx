import {
  Rocket,
  Bug,
  User,
  Home,
  Headphones,
  Heart,
  Box,
  Cone,
  Cylinder,
  Pyramid,
  Crown,
  Flame,
  Smile, type LucideIcon
} from "lucide-react";

export interface ClusterIconItem {
  id: string;
  icon: LucideIcon;
  label: string;
}

export const CLUSTER_ICON_LIST: ClusterIconItem[] = [
  { id: "rocket", icon: Rocket, label: "panel.sidebar.cluster.add.dialog.icon.rocket" },
  { id: "bug", icon: Bug, label: "panel.sidebar.cluster.add.dialog.icon.bug" },
  { id: "user", icon: User, label: "panel.sidebar.cluster.add.dialog.icon.user" },
  { id: "home", icon: Home, label: "panel.sidebar.cluster.add.dialog.icon.home" },
  { id: "headphones", icon: Headphones, label: "panel.sidebar.cluster.add.dialog.icon.headphones" },
  { id: "heart", icon: Heart, label: "panel.sidebar.cluster.add.dialog.icon.heart" },
  { id: "box", icon: Box, label: "panel.sidebar.cluster.add.dialog.icon.box" },
  { id: "cone", icon: Cone, label: "panel.sidebar.cluster.add.dialog.icon.cone" },
  { id: "cylinder", icon: Cylinder, label: "panel.sidebar.cluster.add.dialog.icon.cylinder" },
  { id: "pyramid", icon: Pyramid, label: "panel.sidebar.cluster.add.dialog.icon.pyramid" },
  { id: "crown", icon: Crown, label: "panel.sidebar.cluster.add.dialog.icon.crown" },
  { id: "flame", icon: Flame, label: "panel.sidebar.cluster.add.dialog.icon.flame" },
  { id: "smile", icon: Smile, label: "panel.sidebar.cluster.add.dialog.icon.smile" },
];