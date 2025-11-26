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
  { id: "rocket", icon: Rocket, label: "panel.sidebar.cluster.icon.rocket" },
  { id: "bug", icon: Bug, label: "panel.sidebar.cluster.icon.bug" },
  { id: "user", icon: User, label: "panel.sidebar.cluster.icon.user" },
  { id: "home", icon: Home, label: "panel.sidebar.cluster.icon.home" },
  { id: "headphones", icon: Headphones, label: "panel.sidebar.cluster.icon.headphones" },
  { id: "heart", icon: Heart, label: "panel.sidebar.cluster.icon.heart" },
  { id: "box", icon: Box, label: "panel.sidebar.cluster.icon.box" },
  { id: "cone", icon: Cone, label: "panel.sidebar.cluster.icon.cone" },
  { id: "cylinder", icon: Cylinder, label: "panel.sidebar.cluster.icon.cylinder" },
  { id: "pyramid", icon: Pyramid, label: "panel.sidebar.cluster.icon.pyramid" },
  { id: "crown", icon: Crown, label: "panel.sidebar.cluster.icon.crown" },
  { id: "flame", icon: Flame, label: "panel.sidebar.cluster.icon.flame" },
  { id: "smile", icon: Smile, label: "panel.sidebar.cluster.icon.smile" },
];